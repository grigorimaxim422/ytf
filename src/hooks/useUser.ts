import {message} from 'antd';
import {
    GetUser,
    userLogin
} from '../api/apiCalls/user';
import {
    login as _login,
    logout as _logout, setSubscribers,
    setUser,
} from '../redux/reducer';
import {useDispatch, useSelector} from "react-redux";

const useUser = () => {
    const dispatch = useDispatch();

    const login = async (payload: { username: string,password:string }) => {
        try {
            const res = await userLogin(payload);
            localStorage.setItem('token', res.access);
            localStorage.setItem('refreshToken', res.refresh);
            setTimeout(async () => {
                const currentUser = await GetUser();
                if (currentUser) {
                    dispatch(
                        _login({
                            isAuthenticated: true,
                            refreshToken: res.refresh,
                            token: res.access,
                            user: currentUser
                        }),
                    );
                    message.success('Login success');
                }
            }, 500)
            return true;
        } catch (error) {
            console.error('error login', error);
            message.error('Something went wrong');
        }
    };



    const getCurrentUser = async () => {
        try {
            const res = await GetUser();
            // console.log('userrr refresh', res);
            dispatch(setUser(res));
            dispatch(setSubscribers(res.subscribers));

        } catch (error) {
            console.error('error getCurrentUser', error);
        }
    };



    const logout = () => {
        dispatch(_logout());
        localStorage.removeItem('token');

    };


    return {
        login,
        logout,
        getCurrentUser
    };
};

export default useUser;
