import { useState, useEffect } from "react";
import World from './Scenes/World'
import ArcadeGameForm from './Components/ArcadeGameForm'

function App() {
    const [count, setCount] = useState(0)
    const [showMenu, setShowMenu] = useState(false);
    useEffect(() => {

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
    return (
        <>
            <World />
            {
                showMenu && (
                    <ArcadeGameForm
                        gameType="TicTacToe"
                        playerId="player123"
                        onClose={() => setShowMenu(false)}
                        onGameStart={() => { }}
                    />
                )
            }    </>
    )
}

export default App
