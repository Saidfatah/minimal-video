import { ANIMATIONS_TYPES, ExecuteKeyframeAnimationArgs } from '../../../../utils/types';
import { easeInOut, lerp } from '../../../../utils/utils';
import { Dispatch, RootState } from '../../../store.index';

const effect:Function =(dispatch: Dispatch, { timeStamp }: ExecuteKeyframeAnimationArgs, state: RootState) => {
  const shapes = [...state.timeline.shapes];
  const keyframes = [...state.timeline.keyframes];
  const animations = state.timeline.animations;
  if (!keyframes.length) return;

  const targetKeyframes = keyframes.filter((keyframe) => {
    return (
      keyframe.time < timeStamp && timeStamp < keyframe.time + keyframe.duration
    );
  });

  dispatch.timeline.UPDATE_CURRENT_TIME_STAMP(timeStamp);
  targetKeyframes.forEach((keyframe) => {
    // check if there is an animation linked to the time stamp

    const targetAnimation = animations[keyframe.animationId];
    // execute animation on targeted shape
    if (targetAnimation) {
      const indexOfTargetShape = shapes.findIndex(
        (shape) => shape.id === targetAnimation.shapeId
      );

      if (indexOfTargetShape > -1) {
        const type = targetAnimation.type;
        const duration = targetAnimation.duration;
        const elapsedTimeSinceAnimationStart = timeStamp - keyframe.time;
        const value = targetAnimation.value;
        const prevValue = targetAnimation.prevValue;

        const calculatedValue = lerp(
          prevValue,
          value,
          easeInOut(elapsedTimeSinceAnimationStart / duration)
        );
        const hasntFinishedYet =
          prevValue > value
            ? calculatedValue >= value
            : calculatedValue <= value;

        switch (type) {
          case ANIMATIONS_TYPES.moveX:
            if (hasntFinishedYet)
              shapes[indexOfTargetShape].x = calculatedValue;
            break;
          case ANIMATIONS_TYPES.moveY:
            if (hasntFinishedYet)
              shapes[indexOfTargetShape].y = calculatedValue;
            break;
          case ANIMATIONS_TYPES.fadeIn:
            shapes[indexOfTargetShape].opacity = calculatedValue;
            break;
          case ANIMATIONS_TYPES.fadeOut:
            shapes[indexOfTargetShape].opacity = calculatedValue;
            break;
          case ANIMATIONS_TYPES.scaleX:
            shapes[indexOfTargetShape].width = calculatedValue;
            break;
          case ANIMATIONS_TYPES.scaleY:
            shapes[indexOfTargetShape].height = calculatedValue;
            break;
          // case ANIMATIONS_TYPES.popIn:
          //   popIn animation is just two quick scaleY and scaleX
          //   shapes[indexOfTargetShape].height = calculatedValue;
          //   break;
          // case ANIMATIONS_TYPES.popOut:
          //   popIn animation is just two quick scaleY and scaleX
          //   shapes[indexOfTargetShape].height = calculatedValue;
          //   break;

          default:
            break;
        }
        dispatch.timeline.UPDATE_SHAPES(shapes);
      }
    }
  });
};

export default effect