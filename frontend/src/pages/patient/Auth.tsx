import SideAuthComponent from "../../components/auth/SideAuthComponent";
import AuthPage from "../../components/auth/Auth";
import { useEffect, useState } from "react";
import VerificationForm from "../../components/auth/VerificationOTP";
// import Cookies from "js-cookie";
// import { useNavigate } from "react-router-dom";
import AuthAnimations from "../../components/auth/AuthAnimation";
import ChangePassword from "../../components/auth/ChangePassword"

interface AuthProps {
  role: string;
}
const Auth:React.FC<AuthProps> = ({role}) => {
  const [ auth, setAuth] = useState(true)
  const [forgotPassword, setForgorPassword] = useState(false)
  const [changePassword, setChangePassword] = useState(false)
  // const token = Cookies.get('accessToken');
  // const navigate = useNavigate()
  // useEffect(()=>{
  //     if(token){
  //         navigate('/user')
  //     }
  // },[token,navigate])

  const handleAuth = (value:boolean) => {
    setAuth(value)
  }

  const handleForgotPassword = (value: boolean) => {
    setForgorPassword(value)
    setAuth(false)
  } 
  const handleChangePassword = (value: boolean) => {
    setChangePassword(value)
  }

  return (
    <div className="w-[100%] h-[100vh] flex justify-center items-center pt-24">
      <div className="lg:w-[80%] w-[100%] relative flex">
        <div className="w-[50%] justify-center items-center hidden lg:flex mb-10 relative">
          <div className="w-[400px] h-[400px] bg-[#b6ddfb] absolute -top-10 rounded-full blur-2xl">
          </div>
          <SideAuthComponent />
        </div>
        <div className="w-[100%] lg:w-[50%] flex justify-center items-center">
            {changePassword ? <ChangePassword handleChangePassword={handleChangePassword} role={role}/> : 
             auth ? <AuthPage handleAuth={handleAuth} handleForgotPassword={handleForgotPassword} role={role}/> : 
             <VerificationForm handleAuth={handleAuth} forgotPassword={forgotPassword} handleChangePassword={handleChangePassword}/> }
        </div>
      </div>
      <AuthAnimations />
    </div>
  );
}

export default Auth;