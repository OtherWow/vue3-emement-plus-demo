<template>
    <el-button :type="type" :size="size" :disabled="disabled || loading" :loading="loading" @click="handleClick">
        <slot></slot>
    </el-button>
</template>
  
<script>
import { ref } from 'vue';

export default {
    name: 'LoadingButton',
    props: {
        type: {
            type: String,
            default: 'primary'
        },
        size: {
            type: String,
            default: 'default'
        },
        disabled: Boolean,
        action: Function
    },
    setup(props) {
        const loading = ref(false);

        const handleClick = async () => {
            if (props.action) {
                loading.value = true;
                try {
                    await props.action();
                } catch (error) {
                    console.error(error);
                } finally {
                    loading.value = false;
                }
            }
        };

        return {
            loading,
            handleClick
        };
    }
};
</script>
  