<template>
    <el-card class="box-card" style="margin:20px" id="main_card">
        <MdPreview :editorId="id" :modelValue="text" previewTheme="vuepress" />
        <MdCatalog :editorId="id" :scrollElement="scrollElement" />

    </el-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import content from '@/markdown/Mzsm.md'
import { MdPreview, MdCatalog } from 'md-editor-v3';
import 'md-editor-v3/lib/preview.css';
const text = ref('')
const id = 'preview-only';
const scrollElement = document.documentElement;
onMounted(() => {
    text.value = content
})
</script>

<style lang="scss" scoped></style>