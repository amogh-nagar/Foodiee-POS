var Outlet = require("../../../models/outlet");
var Order = require("../../../models/order");
exports.getOutletsTotalReportWithoutDates = function (req, res, next) {
  Order.aggregate(
    [
      {
        $match: {
          "outletDetails.id": {
            $in: req.body.outletIds,
          },
        },
      },
      {
        $group: {
          _id: "$outletDetails.id",
          outletName: { $first: "$outletDetails.name" },
          sell: {
            $sum: "$price",
          },
        },
      },
    ],
    function (err, data) {
      if (err) console.log(err);

      console.log(data);
      res.status(200).json({
        message: "Outlets Report",
        report: data,
      });
    }
  );
};

exports.getOutletsTotalReportWithDates = function (req, res, next) {
  Order.aggregate(
    [
      {
        $match: {
          "outletDetails.id": {
            $in: req.body.outletIds,
          },
        },
      },
      {
        $project: {
          outletDetails: 1,
          _id: 1,
          price: 1,
          orderDate: {
            $substr: ["$date", 0, 10],
          },
        },
      },
      {
        $match: {
          orderDate: {
            $gte: req.body.startDate,
            $lte: req.body.endDate,
          },
        },
      },
      {
        $group: {
          _id: "$outletDetails.id",
          outletName: { $first: "$outletDetails.name" },
          sell: {
            $sum: "$price",
          },
        },
      },
    ],
    function (err, data) {
      if (err) console.log(err);
      console.log(data);

      res.status(200).json({
        message: "Outlets Report",
        report: data,
      });
    }
  );
};

exports.getOutletsHourlyReportWithoutDate = function (req, res, next) {
  console.log(req.body.outletIds);
  Order.aggregate(
    [
      {
        $match: {
          "outletDetails.id": {
            $in: req.body.outletIds,
          },
        },
      },
      {
        $project: {
          outletDetails: 1,
          _id: 1,
          price: 1,
          orderDate: {
            $dateToString: {
              format: "%H",
              timezone: "+0530",
              date: "$date",
            },
          },
        },
      },
      {
        $group: {
          _id: { outletId: "$outletDetails.id", hour: "$orderDate" },
          outletName: { $first: "$outletDetails.name" },
          sell: {
            $sum: "$price",
          },
        },
      },
      {
        $group: {
          _id: "$_id.outletId",
          outletName: { $first: "$outletName" },
          sell: {
            $push: {
              hour: "$_id.hour",
              sell: "$sell",
            },
          },
        },
      },
    ],
    function (err, data) {
      if (err) console.log(err);
      console.log(data);
      res.status(200).json({
        message: "Brands Report",
        report: data,
      });
      console.log(data);
    }
  );
};

exports.getOutletsHourlyReportWithDates = function (req, res, next) {
  Order.aggregate(
    [
      {
        $match: {
          "outletDetails.id": {
            $in: req.body.outletIds,
          },
        },
      },
      {
        $project: {
          outletDetails: 1,
          _id: 1,
          price: 1,
          orderDate: {
            $dateToString: {
              format: "%H",
              timezone: "+0530",
              date: "$date",
            },
          },
          date: {
            $substr: ["$date", 0, 10],
          },
        },
      },
      {
        $match: {
          date: {
            $gte: req.body.startDate,
            $lte: req.body.endDate,
          },
        },
      },
      {
        $group: {
          _id: { outletId: "$outletDetails.id", hour: "$orderDate" },
          outletName: { $first: "$outletDetails.name" },
          sell: {
            $sum: "$price",
          },
        },
      },
      {
        $group: {
          _id: "$_id.outletId",
          outletName: { $first: "$outletName" },
          sell: {
            $push: {
              hour: "$_id.hour",
              sell: "$sell",
            },
          },
        },
      },
    ],
    function (err, data) {
      if (err) console.log(err);
      res.status(200).json({
        message: "Brands Report",
        report: data,
      });
      console.log(data);
    }
  );
};
