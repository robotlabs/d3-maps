export const layoutA = (width, height) => {

  var m = 0;
  var height2 = height / 5 - m;
  if (height2 > 120) {
    height2 = 120;
  }
  let nrItem = 1;
  let nrDivUp = 1;
  let nrDivBottom = 0;
  let wTotalUp = width - (m * (nrDivUp + 1));
  let wTotalBottom = width - (m * (nrDivBottom + 1));
  let t = height - height2 + m;
  let oc = {};
  //** TOP
  oc.w1 = width;//((wTotalUp * 100) / 100);
  oc.h1 = height; - height2;
  oc.l1 = 0;
  oc.t1 = 0;
  //
  oc.nrItem = nrItem;
  return oc;
};

export const layoutB = (width, height) => {
  var m = 0;
  var height2 = height / 5 - m;
  if (height2 > 120) {
    height2 = 120;
  }
  let nrItem = 2;
  let nrDivUp = 1;
  let nrDivBottom = 1;
  let wTotalUp = width - (m * (nrDivUp + 1));
  let wTotalBottom = width - (m * (nrDivBottom + 1));
  let t = height;// - height2 + m;
  let oc = {};
  //** TOP
  oc.w1 = 0;//((wTotalUp * 100) / 100);
  oc.h1 = 0;// - height2;
  oc.l1 = 0;
  oc.t1 = 0;

  //** BOTTOM
  oc.w2 = ((0 * 100) / 100);
  oc.h2 = 0;
  oc.l2 = 0;
  oc.t2 = 0;
  //
  oc.nrItem = nrItem;
  return oc;
};
