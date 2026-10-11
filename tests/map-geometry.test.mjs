import test from 'node:test';
import assert from 'node:assert/strict';
import {project,offset,pan,tiles} from '../mobile/map-geometry.mjs';
test('Map projection stays finite at poles and wraps the date line',()=>{for(const lat of [-90,0,90]){const p=project(lat,180);assert.ok(Number.isFinite(p.y)&&p.y>=0&&p.y<=1);assert.equal(p.x,0);}const d=offset(project(0,-179),project(0,179),4);assert.ok(Math.abs(d.x)<30);});
test('Map dragging clamps latitude and wraps longitude',()=>{const p=pan({x:.99,y:.5},-200,10000,2);assert.ok(p.x>=0&&p.x<1);assert.equal(p.y,0);});
test('Map requests only viewport tiles with valid wrapped indices',()=>{for(const center of [{x:0,y:0},{x:1,y:1},{x:.5,y:.5}]){const t=tiles(center,12,750,340);assert.ok(t.length<=20);for(const tile of t){assert.ok(tile.x>=0&&tile.x<4096&&tile.y>=0&&tile.y<4096);assert.ok(tile.left<=750&&tile.left+256>=0);assert.ok(tile.top<=340&&tile.top+256>=0);}}});
