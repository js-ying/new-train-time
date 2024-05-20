const AdUtils = {
  showAd: (timetablesLength: number, index: number) => {
    if (timetablesLength >= 3 && index === 2) {
      return true;
    }

    if (timetablesLength === 2 && index === 1) {
      return true;
    }

    if (timetablesLength <= 1 && index === 0) {
      return true;
    }

    return false;
  },
};

export default AdUtils;
