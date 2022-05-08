//判断是否登录

const { getToken } = require("@/utils");
const { Navigate } = require("react-router-dom");

//根据一定的判断，返回新的组件
function AuthComponent({ children }){
    const isToken=getToken()
    if(isToken){
        return <>{children}</>
    }else{
        return <Navigate to="/login" replace/>
    }
}

export {AuthComponent}


