import React from "react";

function HomeScreen({ setScreen,setWorldData}){
    async function handleCommonWorld() {
    try {
        const res = await fetch(
            "http://localhost:8080/world/COMMON_WORLD"
        );

        if (!res.ok) {
            console.log("Failed to get common world");
            return;
        }

        const data = await res.json();

        console.log("Common World:", data);

        setWorldData(data);
        setScreen("world");

    } catch (err) {
        console.log(err);
    }
}
    return<>
        <div className="flex items-center justify-center flex-col w-screen h-screen gap-4 bg-zinc-800 text-2xl ">
            <button className="w-50 h-20 border-2 bg-amber-200 rounded-4xl cursor-pointer" onClick={()=>handleCommonWorld()}
                >
                Shared World
            </button>
            <button className="w-50 h-20 border-2 bg-amber-200 rounded-4xl cursor-pointer " onClick={()=>setScreen("private-match")}>
                Private World
                </button>
        </div>
    </>
}

export default HomeScreen;