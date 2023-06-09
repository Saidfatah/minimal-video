import { v4 } from 'uuid';
import { SHAPE_TYPES, ANIMATIONS_TYPES, PartialBy, Omit } from './types';

export interface shapePose {
  x: number;
  y: number;
}
export interface shape {
  x: number;
  y: number;
  id: string;
  width: number;
  height: number;
  fill: string;
  content: string;
  type: SHAPE_TYPES;
  opacity: number;
  isSelected?: boolean;
}
export class Shape implements shape {
  x: number;
  y: number;
  id: string;
  width: number;
  height: number;
  fill: string;
  content: string;
  type: SHAPE_TYPES;
  opacity: number;
  isSelected?: boolean;

  constructor({
    x,
    y,
    width,
    height,
    fill,
    type,
    opacity,
    isSelected
  }: PartialBy<shape, 'content' | 'opacity'|"id">) {
    this.x = x;
    this.y = y;
    this.id = v4();
    this.width = width;
    this.height = height;
    this.fill = fill;
    this.type = type;
    if (type === SHAPE_TYPES.TEXT) this.content = 'INSERT TEXT';
    else this.content = '';
    this.opacity = opacity || 1;
    this.isSelected = isSelected || false;
  }
}

export interface keyframe {
  time: number;
  duration: number;
  animationId: string;
}
export class Keyframe implements keyframe {
  time: number;
  duration: number;
  animationId: string;

  constructor({ time, duration, animationId }: keyframe) {
    this.time = time;
    this.duration = duration;
    this.animationId = animationId;
  }
}

export interface animation {
  id: string;
  shapeId: string;
  type: ANIMATIONS_TYPES;
  duration: number;
  value: number;
  prevValue: number;
}

export class Animation implements animation {
  id: string;
  shapeId: string;
  type: ANIMATIONS_TYPES;
  duration: number;
  value: number;
  prevValue: number;

  constructor({
    shapeId,
    type,
    duration,
    value,
    prevValue
  }: Omit<animation, 'id'>) {
    this.id = v4();
    this.shapeId = shapeId;
    this.type = type;
    this.duration = duration;
    this.value = value;
    this.prevValue = prevValue;
  }
}
