var express = require('express');
var router = express.Router();

let GroceryObject = function (pTitle,pQuantity,pCategory,pPrice,pTotalPrice){
  this.ID=Math.random().toString(16).slice(5);
  this.Title = pTitle;
  this.Quantity = pQuantity;
  this.Category = pCategory;
  this.Price = pPrice;
  this.TotalPrice = pPrice * pQuantity;
}

let serverItemArray = [];

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index.html');
});

/* GET all Item data */
router.get('/getAllItems', function(req, res){
  res.status(200).json(serverItemArray);
});

/* Add one new item */
router.post('/AddItem', function(req, res){
  const newItem =req.body;
  serverItemArray.push(newItem);
  res.status(200).json(newItem);
});

/* Delete one item*/
router.delete('/DeleteItem/:ID',(req, res) => {
  const delID =req.params.ID;

  let found= false;
  let pointer= GetArrayPointer(delID);
  if(pointer==-1){
    console.log("not found");
    return res.status(500).json({
      status:"error - no such ID"
    });
  }
  else{
    serverItemArray.splice(pointer, 1);
    res.send('Item with ID: '+ delID +' Deleted!');
  }
}); 

function GetArrayPointer(localID) {
  for (let i = 0; i < serverItemArray.length; i++) {
      if (localID === serverItemArray[i].ID) {
          return i;
      }
  }
  return -1;
}


module.exports = router;
