<template>
    <el-upload :show-file-list="false" accept="application/pdf" :before-upload="handleUpload">
        <el-button type="primary">选择PDF文件</el-button>
    </el-upload>
    <canvas id="canvas" width="960" style="border: 1px solid;"></canvas>
    <div class="button-container">
        <el-button id="prev" @click="showPrevImage" :disabled="currentPage <= 1">
            上一张
        </el-button>
        <el-button id="next" @click="showNextImage" :disabled="currentPage >= totalPages">
            下一张
        </el-button>
    </div>
</template>

<script>
import { ref } from "vue";
import { ElMessage } from "element-plus";
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.js'

export default {
    setup() {
        // 设置 pdf.js 的 worker 路径
        pdfjsLib.GlobalWorkerOptions.workerSrc = require('pdfjs-dist/build/pdf.worker.entry')

        // 初始化一些引用
        const currentPage = ref(1);  // 当前页码
        const totalPages = ref(0);  // 总页数

        // 不使用ref，而是直接使用变量存储PDF文档对象
        let pdfDoc = null;

        const imgList = ref([]);  // 存储PDF每页转换后的图片数据

        // 处理文件上传
        const handleUpload = async (file) => {
            // 检查文件类型
            if (file.type !== "application/pdf") {
                ElMessage.error("请选择PDF文件");
                return false;
            }
            // 创建文件URL并加载PDF
            const pdfUrl = URL.createObjectURL(file);
            pdfDoc = await pdfjsLib.getDocument(pdfUrl).promise;
            totalPages.value = pdfDoc.numPages;
            imgList.value = new Array(totalPages.value);  // 创建一个新的空数组
            await renderPage(1);  // 预先渲染第一页
            currentPage.value = 1;
            return false;
        };


        const renderPage = async (pageNum) => {
            const page = await pdfDoc.getPage(pageNum);
            const viewport = page.getViewport({ scale: 1 });
            const canvas = document.getElementById("canvas");
            const scale = canvas.width / viewport.width;
            const newViewport = page.getViewport({ scale: scale });
            const canvasHeight = newViewport.height;
            canvas.height = canvasHeight;
            const renderContext = {
                canvasContext: canvas.getContext("2d"),
                viewport: newViewport,
            };
            await page.render(renderContext).promise;
            const imgData = canvas.toDataURL();
            imgList.value[pageNum - 1] = { data: imgData, height: canvasHeight };
        };
        // 渲染图片到画布
        function renderImage() {
            console.log("Rendering image...");
            const img = new Image();
            img.src = imgList.value[currentPage.value - 1].data;
            img.onload = () => {
                const canvas = document.getElementById("canvas");
                canvas.height = imgList.value[currentPage.value - 1].height;
                canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
                console.log("Image rendered");
            };
        }

        // 显示上一张图片
        const showPrevImage = async () => {
            if (currentPage.value > 1) {
                currentPage.value--;
                if (!imgList.value[currentPage.value - 1]) {
                    await renderPage(currentPage.value);
                }
                renderImage();
            }
        };

        // 显示下一张图片
        const showNextImage = async () => {
            if (currentPage.value < totalPages.value) {
                currentPage.value++;
                if (!imgList.value[currentPage.value - 1]) {
                    await renderPage(currentPage.value);
                }
                renderImage();
            }
        };

        return { currentPage, totalPages, handleUpload, showPrevImage, showNextImage };
    },
};
</script>

<style lang="less" scoped>
canvas {
    display: block;
    margin: 20px auto;
}

.button-container {
    display: flex;
    justify-content: center;
}

button {
    margin: 0 10px;
}
</style>
