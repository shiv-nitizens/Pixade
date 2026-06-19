package com.example.tictactoebackend.Controller;

import com.example.tictactoebackend.DataTransferObject.CreateWorldRequest;
import com.example.tictactoebackend.DataTransferObject.JoinWorldRequest;
import com.example.tictactoebackend.DataTransferObject.LeaveWorldRequest;
import com.example.tictactoebackend.Model.PlayerPosition;
import com.example.tictactoebackend.Model.World;
import com.example.tictactoebackend.Service.WorldService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/world")
public class WorldController {

    WorldService worldService;
    SimpMessagingTemplate simpMessagingTemplate;

    public WorldController(WorldService worldService,SimpMessagingTemplate simpMessagingTemplate){
        this.worldService = worldService;
        this.simpMessagingTemplate = simpMessagingTemplate;
    }

    @PostMapping("/create-world")
    public ResponseEntity<World> createWorld(@RequestBody CreateWorldRequest req){
        World world =  worldService.createWorld(req.getPlayerId());
        if(world == null){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return ResponseEntity.ok(world);
    }
    @PostMapping("/join-world")
    public ResponseEntity<World> joinWorld(@RequestBody JoinWorldRequest req){
        World world = worldService.joinWorld(req.getWorldId(),req.getPlayerId());
        if(world == null){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return ResponseEntity.ok(world);
    }
    @GetMapping("/{worldId}")
    public ResponseEntity<World> getWorld(@PathVariable String worldId){
        World world = worldService.getWorld(worldId);
        if(world == null){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return ResponseEntity.ok(world);
    }
    @PostMapping("/leave-world")
    public ResponseEntity<Void> leaveWorld(@RequestBody LeaveWorldRequest req){
        System.out.println("Player Leaving:"+req.getPlayerId());
        worldService.leaveWorld(req.getWorldId(), req.getPlayerId() );
        simpMessagingTemplate.convertAndSend(
                "/topic/worlds/" + req.getWorldId() + "/player-left",
                new PlayerLeftEvent(req.getPlayerId())
        );
        return ResponseEntity.ok().build();
    }
}
