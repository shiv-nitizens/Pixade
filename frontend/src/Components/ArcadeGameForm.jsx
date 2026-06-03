import { useState } from "react";

function ArcadeGameForm({
    gameType,
    playerId,
    onClose,
    onGameStart
}) {

    const [joinGameId, setJoinGameId] = useState("");

    async function handleHostGame() {

        try {

            const res = await fetch(
                "http://localhost:8080/games",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        playerId: playerId
                    })
                }
            );

            if (!res.ok) {
                console.log("Failed to host game");
                return;
            }

            const data = await res.json();

            console.log("Hosted Game:", data);

            onGameStart(data);

        } catch (err) {

            console.log(err);
        }
    }

    async function handleJoinGame() {

        try {

            const res = await fetch(
                `http://localhost:8080/games/${joinGameId}/join`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        playerId: playerId
                    })
                }
            );

            if (!res.ok) {
                console.log(res,"Failed to join game");
                return;
            }
            const data = await res.json();

            console.log("Joined Game:", data);

            onGameStart(data);

        } catch (err) {

            console.log(err);
        }
    }

    return (
        <div
    style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(0,0,0,0.7)"
    }}
>

            <div
                className="
                    bg-zinc-900
                    p-8
                    rounded-xl
                    w-100
                    flex
                    flex-col
                    gap-6
                    border
                    border-zinc-700
                "
            >

                <h1 className="text-3xl text-white font-bold">

                    {gameType}

                </h1>

                <button
                    onClick={handleHostGame}
                    className="
                        bg-green-600
                        hover:bg-green-700
                        text-white
                        py-3
                        rounded-lg
                    "
                >
                    Host Game
                </button>

                <div className="flex flex-col gap-3">

                    <input
                        type="text"
                        placeholder="Enter Game ID"
                        value={joinGameId}
                        onChange={(e) =>
                            setJoinGameId(e.target.value)
                        }
                        className="
                            p-3
                            rounded-lg
                            bg-zinc-800
                            text-white
                            outline-none
                        "
                    />

                    <button
                        onClick={handleJoinGame}
                        className="
                            bg-blue-600
                            hover:bg-blue-700
                            text-white
                            py-3
                            rounded-lg
                        "
                    >
                        Join Game
                    </button>

                </div>

                <button
                    onClick={onClose}
                    className="
                        bg-red-600
                        hover:bg-red-700
                        text-white
                        py-2
                        rounded-lg
                    "
                >
                    Close
                </button>

            </div>

        </div>
    );
}

export default ArcadeGameForm;