export class Circle {
    colors = ["59, 89, 152","85, 172, 238","0, 122, 179","100, 0, 181","187, 0, 0"]
    constructor(x, y, r, color,ctx) {
        this.x = x
        this.y = y
        this.r = r
        this.velocity = {
            x: (Math.random() - 0.5) * 8,
            y: (Math.random()) * 10
        }
        this.thrust = 0.005
        this.color = this.colors[Math.floor(Math.random()*this.colors.length)]
        this.opacity = 1
        this.ctx = ctx
    }
    draw() {
        this.ctx.save()
        this.ctx.beginPath()
        this.ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false)
        this.ctx.fillStyle = "rgba("+this.color+","+this.opacity+")"
        this.ctx.shadowColor = "rgba("+this.color+","+this.opacity+")"
        this.ctx.shadowBlur = 20
        this.ctx.fill()
        this.ctx.closePath()
        this.ctx.restore()
    }
    update() {
        this.draw()
        this.thrust += 0.001
        this.opacity -= 0.005
        this.velocity.y += this.thrust
        this.x += this.velocity.x
        this.y -= this.velocity.y
    }
}