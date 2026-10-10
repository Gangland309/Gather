import test from 'node:test';
import assert from 'node:assert/strict';
import {effectPixels} from '../mobile/camera-effects.ts';
test('camera effects replace green-screen pixels and preserve original and mono output',()=>{const green=new Uint8ClampedArray([20,160,30,255,200,50,40,255]);effectPixels(green,'Original',true);assert.deepEqual([...green.slice(0,4)],[58,15,108,255]);assert.deepEqual([...green.slice(4)],[200,50,40,255]);const mono=new Uint8ClampedArray([200,100,50,255]);effectPixels(mono,'Mono',false);assert.equal(mono[0],mono[1]);assert.equal(mono[1],mono[2]);});
