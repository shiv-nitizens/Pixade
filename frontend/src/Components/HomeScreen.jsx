import React from "react";

function HomeScreen({ setScreen,setWorldData}){
    return<>
        <div className="flex items-center justify-center flex-col w-screen h-screen gap-4 bg-zinc-800 text-2xl ">
            <button className="w-50 h-20 border-2 bg-amber-200 rounded-4xl cursor-pointer" onClick={()=>{
                setWorldData({ worldId: "COMMON_WORLD"});
                setScreen("world");
            }}
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