<template>
  <div>
    <!-- 直接嵌入官方 viewer.html -->
    <iframe
      :src="pdfViewerUrl"
      width="100%"
      height="800px"
      frameborder="0"
    ></iframe>
    <div id="docx-container"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { ref } from 'vue'
import { renderAsync } from 'docx-preview'

const baseUrl = import.meta.env.VITE_API_BASE || ''

// 拼接 viewer.html 路径，根据你实际目录调整
const pdfViewerUrl = ref('/pdf/web/viewer.html')
const getPdf = async () => {
  try {
    // 使用 fetch 获取 PDF 流
    const response = await fetch(`/api/pdf`, { method: 'GET' })

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    // 获取 ArrayBuffer
    const arrayBuffer = await response.arrayBuffer()

    // 将 ArrayBuffer 转换为 Blob
    const blob = new Blob([arrayBuffer], { type: 'application/pdf' })

    // 创建可访问的 URL
    const pdfUrl = URL.createObjectURL(blob)
    console.log('PDF URL:', pdfUrl, blob)

    // 传递给 PDF.js 查看器
    pdfViewerUrl.value = `/pdf/web/viewer.html?file=${encodeURIComponent(
      pdfUrl
    )}`
  } catch (error) {
    console.error('获取 PDF 失败:', error)
  }
}
const getDocx = async () => {
  try {
    // 使用 fetch 获取 PDF 流

    const response = await fetch(`${baseUrl}/docx`, { method: 'GET' })

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    // 获取 ArrayBuffer
    const arrayBuffer = await response.arrayBuffer()

    const docxContainer = document.getElementById('docx-container')

    if (docxContainer) {
      // 渲染 DOCX 到指定容器
      await renderAsync(arrayBuffer, docxContainer, undefined, {
        className: 'docx-render', // 自定义样式类
        breakPages: true, // 启用分页
        ignoreWidth: false, // 保留页面宽度
      })
    }
  } catch (error) {
    console.error('获取 PDF 失败:', error)
  }
}
onMounted(() => {
  getPdf()
  getDocx()
})
onUnmounted(() => {
  if (pdfViewerUrl.value.includes('blob:')) {
    const url = new URL(pdfViewerUrl.value)
    const fileParam = new URLSearchParams(url.search).get('file')
    if (fileParam && fileParam.startsWith('blob:')) {
      URL.revokeObjectURL(fileParam)
    }
  }
})
</script>
