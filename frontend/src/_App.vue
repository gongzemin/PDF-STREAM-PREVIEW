<script setup lang="ts">
import * as pdfjsLib from 'pdfjs-dist'
import { onMounted } from 'vue'

onMounted(() => {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdfjs-dist/pdf.worker.min.mjs'
})

const loadPDF = async () => {
  try {
    console.log('开始加载 PDF...')
    const response = await fetch('/api/pdf') 
    if (!response.ok) {
      throw new Error(`HTTP 错误: ${response.status} ${response.statusText}`)
    }
    const arrayBuffer = await response.arrayBuffer()
    console.log('接收到数据:', arrayBuffer.byteLength, '字节')

    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
    console.log('PDF 加载成功，页数:', pdf.numPages)
    const page = await pdf.getPage(1)

    const canvas = document.getElementById('pdf-canvas') as HTMLCanvasElement
    const context = canvas.getContext('2d')!
    const viewport = page.getViewport({ scale: 1.5 })

    canvas.height = viewport.height
    canvas.width = viewport.width

    await page.render({
      canvasContext: context,
      viewport: viewport,
    }).promise
    console.log('PDF 页面渲染完成')
  } catch (error) {
    console.error('PDF 加载失败:', error)
  }
}
</script>

<template>
  <div>
    <button @click="loadPDF">加载 PDF</button>
    <canvas id="pdf-canvas"></canvas>
  </div>
</template>

<style scoped>
#pdf-canvas {
  border: 1px solid #ccc;
  margin-top: 10px;
}
</style>
