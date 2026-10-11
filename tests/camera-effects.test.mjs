import test from 'node:test';
import assert from 'node:assert/strict';
import {effectPixels} from '../mobile/camera-effects.ts';
test('uploaded background replaces only keyed green pixels and survives camera filters',()=>{
 const camera=new Uint8ClampedArray([20,160,30,255,200,50,40,255]);
 const background=new Uint8ClampedArray([10,20,230,255,50,60,70,255]);
 effectPixels(camera,'Mono',true,background);
 assert.deepEqual([...camera.slice(0,4)],[10,20,230,255]);
 assert.equal(camera[4],camera[5]);assert.equal(camera[5],camera[6]);assert.equal(camera[7],255);
 const original=new Uint8ClampedArray([20,160,30,255]);effectPixels(original,'Original',false,background);
 assert.deepEqual([...original],[20,160,30,255]);
});
test('camera effects replace green-screen pixels and preserve original and mono output',()=>{const green=new Uint8ClampedArray([20,160,30,255,200,50,40,255]);effectPixels(green,'Original',true);assert.deepEqual([...green.slice(0,4)],[58,15,108,255]);assert.deepEqual([...green.slice(4)],[200,50,40,255]);const mono=new Uint8ClampedArray([200,100,50,255]);effectPixels(mono,'Mono',false);assert.equal(mono[0],mono[1]);assert.equal(mono[1],mono[2]);});
