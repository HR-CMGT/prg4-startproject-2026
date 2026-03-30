import { Actor, Vector, CollisionType, Keys } from "excalibur"
import { Resources } from './resources.js'
import { Platform } from './platform.js'

export class Player extends Actor {
    // Track if player is touching ground (to prevent double-jump)
    isGrounded = false
    jumpForce = 300

    constructor() {
        super({
            width: 40,
            height: 60,
            collisionType: CollisionType.Active
        })
    }

    onInitialize(engine) {
        this.graphics.use(Resources.Player.toSprite())
        this.pos = new Vector(100, 100)
        this.body.mass = 7
    }

    onPreUpdate(engine, delta) {
        this.handleMovement(engine)
        this.handleJump(engine, delta)
    }

    // Handle left/right movement with WASD or arrow keys
    handleMovement(engine) {
        let xspeed = 0

        if (engine.input.keyboard.isHeld(Keys.D) || engine.input.keyboard.isHeld(Keys.Right)) {
            xspeed = 200
            this.graphics.flipHorizontal = false
        }

        if (engine.input.keyboard.isHeld(Keys.A) || engine.input.keyboard.isHeld(Keys.Left)) {
            xspeed = -200
            this.graphics.flipHorizontal = true
        }

        // Maintain vertical velocity from gravity, only change horizontal
        this.vel = new Vector(xspeed, this.vel.y)
    }

    // Handle jumping with Space
    handleJump(engine, delta) {
        if (engine.input.keyboard.wasPressed(Keys.Space) && this.isGrounded) {
            this.body.applyLinearImpulse(new Vector(0, -this.jumpForce * delta))
            this.isGrounded = false
        }
    }

    // Detect when player lands on a platform
    onCollisionStart(event) {
        if (event.other.owner instanceof Platform) {
            // Only allow jump if collision normal points upward (standing on platform)
            if (event.contact.normal.y < -0.5) {
                this.isGrounded = true
            }
        }
    }

    // Reset isGrounded when leaving a platform
    onCollisionEnd(event) {
        if (event.other.owner instanceof Platform) {
            this.isGrounded = false
        }
    }

    onPostUpdate() {
        // Reset game if player falls off the world
        if (this.pos.y > 1000) {
            this.pos = new Vector(100, 100)
            this.vel = Vector.Zero
        }
    }
}
