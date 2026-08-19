import { useContext } from "react";
import { AuthContext } from "../auth.context";
import { login, register, logout, getMe } from "../services/auth.api";


export const useAuth = () => {
    const context = useContext(AuthContext)
    const { user, setUser, loading, setLoading } = context

    const handleLogin = async ({ email, password }) => {
        setLoading(true) // when user clicks the btn and the api is called till the api is doing the work we need to show loading to the user
        try {
            const data = await login({ email, password })
            // here when user hits login btn the api is called via the 'login' function inside the 'auth.api.js' which sends req to backend where the login logic is implemented,
            // if login req is successful then it sends message, user and token (check auth.controller.js in Backend folder) to the 'data' variable in response to the req 

            setUser(data.user)
            return data
        } catch (err) {
            return err
        } finally {
            setLoading(false)  // api is done now 
        }

    }

    const handleRegister = async ({ username, email, password }) => {
        setLoading(true)
        try {
            const data = await register({ username, email, password })

            setUser(data.user)
            return data
        } catch (err) {
            return err
        } finally {
            setLoading(false)
        }

    }

    const handleLogout = async () => {
        setLoading(true)
        try {
            const data = await logout()

            setUser(null)
            return data
        } catch (err) {
            return err
        } finally {
            setLoading(false)
        }

    }

    const handleGetMe = async () => {
        setLoading(true)
        try {
            const data = await getMe()

            setUser(data.user)
            return data
        } catch (err) {
            return err
        } finally {
            setLoading(false)
        }
    }

    return { user, loading, handleLogin, handleRegister, handleLogout, handleGetMe }

}