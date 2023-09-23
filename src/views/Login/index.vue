<template>
    <div class="login-container">
        <el-card class="login-card">
            <h1 class="login-title">登录</h1>
            <el-form label-width="80px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="loginForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input type="password" v-model="loginForm.password"></el-input>
                </el-form-item>
                <el-form-item>
                    <loading-button :action="submitLoginForm">登录</loading-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>
  
  
  
<script setup>
import { ref, inject } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { api_登录 } from '@/api/auth_api'
const loginForm = ref({
    username: '',
    password: '',
});
const router = useRouter();
const submitLoginForm = async () => {
    const global = inject('$global');
    console.log('submitLoginForm');
    try {
        console.log(loginForm.value);
        // 调用登录 API，并将 token 保存在本地存储中。
        const response = await api_登录(loginForm.value.username, loginForm.value.password);
        const token = response.data.access_token;
        console.log(response.data);
        localStorage.setItem('token', token);
        localStorage.setItem('username', loginForm.value.username);
        // localStorage.setItem('token', "111");
        // 使用 Element Plus 的 message 组件显示成功提示
        ElMessage({
            message: '登录成功！',
            type: 'success',
        });

        // 重定向到主页面
        router.push('/');
    } catch (error) {
        console.log(error);
        // 使用 Element Plus 的 message 组件显示错误提示
        ElMessage({
            message: '登录失败，请检查您的用户名和密码！',
            type: 'error',
        });
    }
};
</script>
  
<style lang="less" scoped>
.login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: #f0f2f5;
}

.login-card {
    width: 400px;
    padding: 30px 20px;
}

.login-title {
    text-align: center;
    margin-bottom: 20px;
}
</style>
  