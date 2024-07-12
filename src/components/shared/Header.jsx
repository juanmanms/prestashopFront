import NavBar from "./NavBar"
import { useSelector, useDispatch } from "react-redux"
import { logout } from "../login/loginService";


export const Header = () => {
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();

    const handleLogout = () => {
        logout(dispatch);
    };

    return (
        <>
            <nav className="bg-white border-gray-200 dark:bg-gray-900">
                <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl p-4">
                    <a href="https://flowbite.com" className="flex items-center space-x-3 rtl:space-x-reverse">

                        <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Torreblanca</span>
                    </a>
                    <div className="flex items-center space-x-6 rtl:space-x-reverse">
                        <a href="tel:5541251234" className="text-sm text-gray-500 dark:text-white hover:underline">{user.name}</a>
                        <button onClick={handleLogout} className="text-sm text-blue-600 dark:text-blue-500 hover:underline">Cerrar</button>
                    </div>
                </div>
            </nav>
            <NavBar />
        </>
    )
}
