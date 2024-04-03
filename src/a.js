/**
 * @param {(goban) => void} cb
 */
function withGoban(cb) {
  // Goban object is exposed globally by:
  // https://github.com/online-go/online-go.com/blob/f8040d9de57785e7d39043ec7209dd014ef0518d/src/views/Game/Game.tsx#L1113
  const propertyName = 'global_goban';
  const goban = window[propertyName];

  if (goban) {
    cb(goban);
  } else {
    console.warn(`window.${propertyName} is ${goban}`);
  }
}

/**
 * @param {number} moveNumber
 */
function goToMove(moveNumber) {
  withGoban(goban => {
    goban.showFirst && goban.showFirst();
    let i = 0;
    while (i < moveNumber - 1) {
      goban.showNext && goban.showNext();
      i += 1;
    }
    // Mimics this
    // https://github.com/online-go/online-go.com/blob/f8040d9de57785e7d39043ec7209dd014ef0518d/src/views/Game/Game.tsx#L302
    // https://github.com/online-go/online-go.com/blob/f8040d9de57785e7d39043ec7209dd014ef0518d/src/views/Game/Game.tsx#L359
  });
}
