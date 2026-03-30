# Collision Detection Guide

## Collision Events

ExcaliburJS fires collision events automatically when actors collide.

### onCollisionStart()
Fired when two actors begin colliding (first frame of contact).

```js
onCollisionStart(event) {
    console.log("Collision started with:", event.other.owner)
}
```

### onCollisionEnd()
Fired when two actors stop colliding (last frame of contact).

```js
onCollisionEnd(event) {
    console.log("Collision ended with:", event.other.owner)
}
```

## Using Contact Information

The collision event provides contact details:

```js
onCollisionStart(event) {
    const contact = event.contact
    console.log("Normal vector:", contact.normal) // Direction of collision
    console.log("Penetration:", contact.mtv) // How much actors overlap
}
```

The **normal vector** points away from the colliding actor. For grounding detection:
- If `normal.y < -0.5`: Collision from above (standing on platform)
- If `normal.y > 0.5`: Collision from below (hitting head)
- If `normal.x > 0.5` or `normal.x < -0.5`: Side collision (wall)

## Type Checking with instanceof

Identify which actor you collided with:

```js
import { Platform } from './platform.js'
import { Enemy } from './enemy.js'

onCollisionStart(event) {
    if (event.other.owner instanceof Platform) {
        console.log("Hit a platform")
    } else if (event.other.owner instanceof Enemy) {
        console.log("Hit an enemy")
    }
}
```

## Detecting Grounding

For secure jump detection:

```js
onCollisionStart(event) {
    if (event.other.owner instanceof Platform && event.contact.normal.y < -0.5) {
        this.isGrounded = true
    }
}

onCollisionEnd(event) {
    if (event.other.owner instanceof Platform) {
        this.isGrounded = false
    }
}
```

## Collision Groups (Advanced)

Prevent certain actors from colliding with each other:

```js
import { CollisionGroup } from "excalibur"

// Create groups
const playerGroup = new CollisionGroup("player", 0b0001, 0b1110)
const platformGroup = new CollisionGroup("platforms", 0b0010, 0b1101)

player.body.group = playerGroup
platform.body.group = platformGroup
```

## Debugging Collisions

Enable debug rendering to visualize collision boxes:

```js
game.showDebug(true)
```

This will draw:
- Red outlines: Collision boxes
- Green lines: Contact normals
- Yellow dots: Contact points
