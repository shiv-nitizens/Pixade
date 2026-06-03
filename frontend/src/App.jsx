import { useState, useEffect } from "react";
import { v4 as uuid } from "uuid";
import World from './Scenes/World'
import ArcadeGameForm from './Components/ArcadeGameForm'
import HomeScreen from "./Components/HomeScreen";

function App() {
    const [showMenu, setShowMenu] = useState(false);
    const [playerId,setPlayerId] = useState(null);
    const [screen,setScreen] = useState("HomeScreen");

    const onGameStart = (game) => {

    setShowMenu(false);

    window.dispatchEvent(
        new CustomEvent(
            "start-tictactoe",
            {
                detail: {
                    gameId: game.gameId,
                    playerId: playerId
                }
            }
        )
    );
};
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
            />
            }
        if(screen == "world"){
            return <World/>
        }
        if(screen == "private-match"){
            return <ArcadeGameForm
                        gameType="TicTacToe"
                        playerId={playerId}
                        onClose={() => setShowMenu(false)}
                        onGameStart={onGameStart}
                    />
        }
        return
}

export default App
