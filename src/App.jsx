import React, { useState, useEffect, useRef, useCallback } from 'react';
import useWatch from './useWatch'; 
import useInterval from './useInterval';

const App = () => {
  const canvasRef = useRef(null);
  const [piece, setPiece] =  useState({width: 30, height: 30, x: 10, y:120});
  const [obstacles, setObstacles] = useState([
          {width: 15, height: 50, x: 100, y:0}, 
          {width: 15, height: 50, x: 100, y:220}]);
  const [frameNo, setFrameNo] = useState(0);
  const [isCrashed, setIsCrashed] = useState(false);
  
  const handleKeyDown = useCallback((e) => {
    switch(e.key) {
      case "ArrowLeft": 
        setPiece((p)=>{ return {width: p.width, height: p.height, x: p.x-2, y:p.y} });
        break;
      case "ArrowRight": 
        setPiece((p)=>{ return {width: p.width, height: p.height, x: p.x+2, y:p.y} });
        break;
      case "ArrowUp": 
        setPiece((p)=>{ return {width: p.width, height: p.height, x: p.x, y:p.y-2} });
        break;
      case "ArrowDown": 
        setPiece((p)=>{ return {width: p.width, height: p.height, x: p.x, y:p.y+2} });
        break;
      default: ;
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const [start, stop] = useInterval(() => { setFrameNo((n) => n+1); }, 20);
  useEffect(() => {
    console.log("!!")
    start();
  }, [])

  useWatch(frameNo, (nv) => {
    if(nv === 0 || (nv / 150) % 1 === 0){
      const canvas = canvasRef.current;
      const x = canvas.width;
      const y = canvas.height;
      const minHeight = 20;
      const maxHeight = 200;
      const height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
      const minGap = 50;
      const maxGap = 200;
      const gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
      setObstacles((obstacles) => {
        const tmp = obstacles[0].x + obstacles[0].width < 0 ? obstacles.slice(2) : obstacles;
        return [...tmp.map((o) => { o.x += -1; return o;}), 
          {width: 15, height, x, y: 0}, 
          {width: 15, height: y - height - gap, x, y: height + gap}
        ];
      });
    }
    else 
      setObstacles((obstacles) => {
        const tmp = obstacles[0].x + obstacles[0].width < 0 ? obstacles.slice(2) : obstacles;
        return tmp.map((o) => { o.x += -1; return o;});
      });
  });

  useWatch([piece, obstacles], ([np, no]) => { //判斷是否撞到障礙物
    const myleft = np.x;
    const myright = np.x + (np.width);
    const mytop = np.y;
    const mybottom = np.y + (np.height);
    for(let i = 0; i < no.length; i++) {
      const otherleft = no[i].x;
      const otherright = no[i].x + (no[i].width);
      const othertop = no[i].y;
      const otherbottom = no[i].y + (no[i].height);
      if (!((mybottom < othertop) || (mytop > otherbottom) ||
        (myright < otherleft) ||
        (myleft > otherright))) {
          setIsCrashed(true);
      }
    }
  });

  useWatch(isCrashed, (nv) => {
    if(nv) {
      window.removeEventListener('keydown', handleKeyDown);
      stop();
    }
  });

  useEffect(()=> {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    //draw piece
    ctx.fillStyle = "red";
    ctx.fillRect(piece.x, piece.y, piece.width, piece.height);

    //draw obstacles
    for(let i = 0; i < obstacles.length; i++){
      ctx.fillStyle = "green";
      ctx.fillRect(obstacles[i].x, obstacles[i].y, obstacles[i].width, obstacles[i].height);
    }

    //draw score
    ctx.fillStyle = "black";
    ctx.font = "30px Consolas";
    ctx.fillText("SCORE: " + frameNo, 20, 40);

  });
  
  return (
    <canvas
      ref={canvasRef}
      width={480}
      height={270}
      style={{border:"3px solid gray"}}
    />
  );
}

export default App;
