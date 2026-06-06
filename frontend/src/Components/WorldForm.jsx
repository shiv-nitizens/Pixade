import { useState } from "react";

function WorldForm({setWorldData,playerId,onClose,setScreen}) 
{
    const [joinWorldId, setJoinWorldId] = useState("");
    async function handleHostWorld() {
        try {
            const res = await fetch(
                "http://localhost:8080/world/create-world",
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
                console.log("Failed to host world");
                return;
            }
            const data = await res.json();
            console.log("Hosted World:", data);
            setWorldData(data);
            setScreen("world");
            
        } catch (err) {
            console.log(err);
        }
    }

    async function handleJoinWorld() {
        try {
            const res = await fetch(
                "http://localhost:8080/world/join-world",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        worldId: joinWorldId,
                        playerId: playerId
                    })
                }
            );

            if (!res.ok) {
                console.log(res,"Failed to join World");
                return;
            }
            const data = await res.json();
            console.log("Joined world:", data);
            setWorldData(data);
            setScreen("world");
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div
    style={{position: "fixed",inset: 0,zIndex: 9999,background: "rgba(0,0,0,0.7)" }}>
            <div className="bg-zinc-900 p-8 rounded-xl w-100 flex flex-col gap-6 border border-zinc-700" >
                <button onClick={handleHostWorld} className="bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg">
                    Host World
                </button>

                <div className="flex flex-col gap-3">
                    <input type="text" placeholder="Enter World ID" value={joinWorldId} onChange={(e) =>
                            setJoinWorldId(e.target.value)
                        }
                        className="p-3 rounded-lg bg-zinc-800 text-white outline-none"
                    />
                    <button
                        onClick={handleJoinWorld} className=" bg-blue-600  hover:bg-blue-700 text-white py-3  rounded-lg" >
                        Join World
                    </button>
                </div>

                <button
                    onClick={onClose}
                    className=" bg-red-600 hover:bg-red-700 text-whitepy-2rounded-lg">
                    Close
                </button>
            </div>
        </div>
    );
}

export default WorldForm;