const { createApp } = Vue
const pdfjsLib = window['pdfjs-dist/build/pdf']
pdfjsLib.GlobalWorkerOptions.workerSrc =
  'https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js'

createApp({
  methods: {
    async loadPDF() {
      try {
        // 获取 PDF 文件流
        const response = await fetch('/pdf')
        const arrayBuffer = await response.arrayBuffer()

        // 使用 pdfjs 加载 PDF
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
        const page = await pdf.getPage(1)

        // 设置画布
        const canvas = document.getElementById('pdf-canvas')
        const context = canvas.getContext('2d')
        const viewport = page.getViewport({ scale: 1.5 })

        canvas.height = viewport.height
        canvas.width = viewport.width

        // 渲染 PDF 页面
        await page.render({
          canvasContext: context,
          viewport: viewport,
        }).promise
      } catch (error) {
        console.error('PDF 加载失败:', error)
      }
    },
  },
}).mount('#app')
