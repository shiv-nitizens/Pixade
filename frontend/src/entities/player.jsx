class Player{
    constructor(scene){
        this.scene = scene;
        this.sprite = this.scene.add.sprite(900,1150,"idle-down");
        this.sprite.setScale(0.10); 
    }
}

export default Player;