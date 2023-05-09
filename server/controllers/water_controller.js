const Water = require("../models/Water_model");

exports.upload = async (req, res) => {
  const time = req.body.time;
  const CIT_01 = req.body.CIT_01;
  const TIT_01 = req.body.TIT_01;
  const PIT_03 = req.body.PIT_03;
  const PIT_04 = req.body.PIT_04;
  const Stage1_Pressure_Drop = req.body.Stage1_Pressure_Drop;
  const PIT_05 = req.body.PIT_05;
  const PIT_06 = req.body.PIT_06;
  const Stage2_Pressure_Drop = req.body.Stage2_Pressure_Drop;
  const FIT_03 = req.body.FIT_03;
  const CIT_02 = req.body.CIT_02;
  const PIT_07 = req.body.PIT_07;
  const FIT_02 = req.body.FIT_02;
  const FIT_01 = req.body.FIT_01;
  let water;
  try {
    // שמירה ב-DB
    water = new Water({
      time,
      CIT_01,
      TIT_01,
      PIT_03,
      PIT_04,
      Stage1_Pressure_Drop,
      PIT_05,
      PIT_06,
      Stage2_Pressure_Drop,
      FIT_03,
      CIT_02,
      PIT_07,
      FIT_02,
      FIT_01,
    });

    await water.save();
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
  if (!water) {
    return res.status(500).json({ message: "לא נוסף למסד הנתונים." });
  }
  return res.status(201).json({ message: " נוסף למסד הנתונים.", water });
};
