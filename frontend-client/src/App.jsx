import './App.css'
import GeneralWindow from "./components/GeneralWindow.jsx";
import ChatWindow from "./components/ChatWindow.jsx";
import InputField from "./components/InputField.jsx";
import {useSelector} from "react-redux";
import Toggles from "./components/Toggles.jsx";


function App() {
    const {splitChat} = useSelector((state) => state.messageState)
    return (
        <>
            <Toggles/>
            <GeneralWindow/>
            {splitChat && (
                <ChatWindow/>)}
            <InputField/>
        </>
    )
}

export default App
