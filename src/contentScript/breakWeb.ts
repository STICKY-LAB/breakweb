import fixElement from "./fixElement";
import getElements from "./getElements";
import { Engine, World, Bodies, Body, Render } from "matter-js";
import { unstable_batchedUpdates } from "react-dom";


function breakWeb() {
    const maxDepth = 6;
    const height = Math.max(document.body.offsetHeight, innerHeight);
    const elements = getElements(document.body, maxDepth);
    const boxs = elements
        .map(({ element }) => element.getBoundingClientRect())
        .map(({x, y, width, height}) => ({
            x,
            y: y + scrollY,
            width,
            height
        }));

    for(const { element, depth } of elements) {
        fixElement(element, depth === maxDepth);
    }

    document.body.innerHTML = "";
    document.body.style.position = "relative";
    document.body.style.height = height + "px";

    let lastDepth = 0;
    let count = 0;
    for(const i in elements) {
        const { element, depth } = elements[i];

        if(lastDepth !== depth) {
            count = 0;
        }

        
        const style = (<any>element).style;
        const box = boxs[i];
        Object.assign(
            style,
            {
                position: "absolute",
                top: box.y + "px",
                left: box.x + "px",
                margin: "0",
                zIndex: (10000*depth + Number(style.zIndex === "auto" ? 0 : style.zIndex)) + ""
            }
        );

        document.body.appendChild(element);

        count++;
    }



    // PHYSICS
    const weight = 20;
    const engine = Engine.create();
    Engine.run(engine);

    engine.world.gravity.y = 0.08;

    const physicsBoxs = boxs.map(({x, y, width, height}) => {
        const parts : Body[] = [];

        //parts.push(Bodies.rectangle(x + width/2, y + height/2, width, height));

        // W
        parts.push(Bodies.rectangle(x + width/2, y + weight/2, width, weight));

        // D
        parts.push(Bodies.rectangle(x + width - weight/2, y + height/2, weight, height));

        // // S
        parts.push(Bodies.rectangle(x + width/2, y + height - weight/2, width, weight));

        // // A
        parts.push(Bodies.rectangle(x + weight/2, y + height/2, weight, height));

        return Body.create({parts});
    });

    World.add(engine.world, physicsBoxs);

    {
        const weight = 100;
        const floor = Bodies.rectangle(innerWidth/2, height + weight/2, innerWidth, weight*2, { isStatic:true });
        World.add(engine.world, floor);

        const ceil = Bodies.rectangle(innerWidth/2, -weight/2, innerWidth, weight, { isStatic:true });
        World.add(engine.world, ceil);

        const right = Bodies.rectangle(innerWidth + weight/2, height/2, weight, height, { isStatic:true });
        World.add(engine.world, right);

        const left = Bodies.rectangle(-weight/2, height/2, weight, height, { isStatic:true });
        World.add(engine.world, left);
    }

    function update() {
        if(dt < 100) {
            Engine.update(engine, dt);
        }
        for(let i = 0; i < physicsBoxs.length; i++) {
            const box = physicsBoxs[i];
            if(box.position.y > height) {
                physicsBoxs.splice(i, 1);
                elements.splice(i, 1);
                i--;
            }
        }
    }

    function render() {
        for(const i in elements) {
            const box = physicsBoxs[i];
            const { element, depth } = elements[i];
            Object.assign(
                (<any>element).style,
                {
                    top: box.position.y + "px",
                    left: box.position.x + "px",
                    //"transform-origin": "top left",
                    transform: `translate(-50%, -50%) rotate(${box.angle}rad)`
                }
            );
        }

    }

    let lastTime = performance.now();
    let dt = 0;
    function frame() {
        const newTime = performance.now();
        dt = newTime - lastTime;
        lastTime = newTime;
        update();
        render();
        requestAnimationFrame(frame);
    }
    frame();




    // FORCE FORCE
    let mouse : {x: number, y: number, box: Body, time: number };

    document.body.addEventListener("mousemove", e => {
        if(!mouse) return;
        
        const newTime = performance.now();
        const xP = (e.clientX - mouse.x)/(newTime - mouse.time);
        const yP = (e.clientY - mouse.y)/(newTime - mouse.time);
        const C = 0.05;
        mouse.box.force.x += xP * C;
        mouse.box.force.y += yP * C;

        mouse.x = e.clientX;
        mouse.y = e.clientY;
        mouse.time = performance.now();
    });

    document.body.addEventListener("mouseup", e => {
        mouse = undefined;
    }, true);

    for(const i in elements) {
        const element = elements[i].element;
        const box = physicsBoxs[i];
        (<HTMLElement>element).addEventListener("mousedown", e => {
            mouse = {
                x: e.clientX,
                y: e.clientY,
                box,
                time: performance.now()
            }
        });
    }



    // // SSIBAL
    // const e = document.createElement("div");
    // e.style.position = "absolute";
    // e.style.width = "100vw";
    // e.style.height = "100vh";
    // e.style.margin = "0";
    // e.style.padding = "0";
    // document.body.appendChild(e);
    // var renderer = Render.create({
    //     element: e,
    //     engine: engine,
    //     options: {
    //         height: innerHeight,
    //         width: innerWidth
    //     }
    // });

    // Render.run(renderer);

    // LINE

    // const canvas = document.createElement("canvas");
    // const ctx = canvas.getContext("2d");

    // canvas.width = document.body.offsetWidth;
    // canvas.height = document.body.offsetHeight;

    // canvas.style.position = "absolute";
    // canvas.style.zIndex = "100";
    // canvas.style.top = "0";
    
    // for(const { x, y, width, height } of boxs) {
    //     ctx.rect(x, y, width, height);
    //     ctx.strokeStyle = "red";
    //     ctx.stroke();
    // }

    // document.body.appendChild(canvas);
}

export default breakWeb;