import { useState, useEffect } from "react";
import { v4 as uuid } from "uuid";
import World from './Scenes/World'
import  WorldForm from './Components/WorldForm'
import HomeScreen from "./Components/HomeScreen";

function App() {
    const [showMenu, setShowMenu] = useState(false);
    const [playerId,setPlayerId] = useState(null);
    const [screen,setScreen] = useState("HomeScreen");
    const [worldData ,setWorldData] = useState(null);
    console.log(playerId);
    useEffect(() => {
        let id = localStorage.getItem("playerId");
        if(!id){
            id = uuid();
            localStorage.setItem("playerId",id);
        }
        setPlayerId(id);

        function openMenu() {

            setShowMenu(true);
        }
        window.addEventListener(
            "open-menu",
            openMenu
        );
        return () => {

            window.removeEventListener(
                "open-menu",
                openMenu
            );
        };

    }, []);
        if(screen == "HomeScreen"){
                return <HomeScreen
                setScreen={setScreen}
                setWorldData={setWorldData}
            />
            }
        if(screen == "world" && worldData){
            return <World
                worldId={worldData.WorldId}
                playerId={playerId}
                
                />
        }
        if(screen == "private-match"){
            return <WorldForm
                        setWorldData={setWorldData}
                        playerId={playerId}
                        onClose={() => setShowMenu(false)}
                        setScreen={setScreen}
                    />
        }
        return
}

export default App
