//Start by creating data
let itemArray=[];
let TotalPrice=0;

//Define a constructor to create grocery objects
let GroceryObject = function (pTitle,pQuantity,pCategory,pPrice,pTotalPrice){
    this.ID=Math.random().toString(16).slice(5);
    this.Title = pTitle;
    this.Quantity = pQuantity;
    this.Category = pCategory;
    this.Price = pPrice;
    this.TotalPrice = pPrice * pQuantity;
}

//itemArray.push(new GroceryObject("banana",2,"Fruits",2));

let selectedCateg = "not selected";


document.addEventListener("DOMContentLoaded", function () {

    //createList();
//Add button events ************************************************************************
    
    document.getElementById("buttonAdd").addEventListener("click", function () {
        let newItem = new GroceryObject(document.getElementById("title").value,
        document.getElementById("quantity").value,
        selectedCateg,
        document.getElementById("price").value);
        document.location.href = "index.html#ListAll";
        //Add the URL value

        $.ajax({
            url:"/AddItem",
            type:"POST",
            data: JSON.stringify(newItem),
            contentType:"application/json; charser=utf-8",
            success: function(result){
                console.log(result);
                document.location.href="index.html#ListAll";
            }
        });
    });

    
    
    document.getElementById("buttonClear").addEventListener("click", function () {
        document.getElementById("title").value = "";
        document.getElementById("quantity").value = "";
        document.getElementById("price").value = "";
    });

    $(document).bind("change", "#select-categ", function (event, ui) {
        selectedCateg = $('#select-categ').val();
    });

    document.getElementById("delete").addEventListener("click", function(){
        let localParm = localStorage.getItem('parm');
        deleteItem(localParm);
    });

    document.getElementById("buttonSortTitle").addEventListener("click", function () {
    
       var theList = document.getElementById("ItemListul");
       theList.innerHTML = "";
   
       $.get("/getAllItems", function(data, status){
           itemArray=data;
       
                itemArray.sort(function (a, b) {
                    if (a.Title.toLowerCase() < b.Title.toLowerCase()) {
                      return -1;
                    }
                    if (a.Title.toLowerCase() > b.Title.toLowerCase()) {
                      return 1;
                    }
                    return 0;
                });
                itemArray.forEach(function (element,i) {  
                    var li = document.createElement('li');
                    li.classList.add('oneItem');
                    li.setAttribute("data-parm",element.ID)
                    li.innerHTML =  itemArray[i].ID + ":  " + element.Title + " " + element.Category;
                    theList.appendChild(li)
                 });
                 var lilist= document.getElementsByClassName("oneItem");
                 let newItemArray = Array.from(lilist);
                 newItemArray.forEach(function (element,i){
                     element.addEventListener('click',function(){
                         var parm = this.getAttribute("data-parm");
                         localStorage.setItem('parm',parm);
     
                         let stringItemArray= JSON.stringify(itemArray);
                         localStorage.setItem('itemArray',stringItemArray);
                         document.location.href="index.html#details";
                     });
                 });
          });
        
        document.location.href = "index.html#ListAll";
    });


    
    document.getElementById("buttonSortCateg").addEventListener("click",function(){
        var theList = document.getElementById("ItemListul");
       theList.innerHTML = "";
   
       $.get("/getAllItems", function(data, status){
           itemArray=data;
       
        itemArray.sort(function(a,b){
            if (a.Category < b.Category) {
                return -1;
              }
              if (a.Category > b.Category) {
                return 1;
              }
              return 0;
            });   
        itemArray.forEach(function (element,i) {  
                var li = document.createElement('li');
                li.classList.add('oneItem');
                li.setAttribute("data-parm",element.ID)
                li.innerHTML =  itemArray[i].ID + ":  " + element.Title + " " + element.Category;
                theList.appendChild(li)
             });
             var lilist= document.getElementsByClassName("oneItem");
             let newItemArray = Array.from(lilist);
             newItemArray.forEach(function (element,i){
                 element.addEventListener('click',function(){
                     var parm = this.getAttribute("data-parm");
                     localStorage.setItem('parm',parm);
 
                     let stringItemArray= JSON.stringify(itemArray);
                     localStorage.setItem('itemArray',stringItemArray);
                     document.location.href="index.html#details";
                 });
             });
            });
            document.location.href = "index.html#ListAll";
    });
    

    document.getElementById("buttonBackToEdit").addEventListener("click", function(){
        //var ItemListul= document.getElementById("ItemListul");
        //ItemListul.innerHTML=" ";
        //itemArray=[];
        document.location.href = "index.html#Edit";
    });
   
    // page before show code *************************************************************************
    $(document).on("pagebeforeshow", "#ListAll", function (event) {   // have to use jQuery 
        createList();
    });
    
    $(document).on("pagebeforeshow", "#Cost", function (event) {   // have to use jQuery 
        createList1();
    });

    $(document).on("pagebeforeshow", "#details", function(event){
        let localID= localStorage.getItem('parm');// get the unique id 
        itemArray= JSON.parse(localStorage.getItem('itemArray'));
        let pointer=GetArrayPointer(localID);
        document.getElementById('itemID').innerHTML="ID: " + localID;
        document.getElementById('itemCategory').innerHTML="Category: " + itemArray[pointer].Category;
        document.getElementById('itemTitle').innerHTML="Item: " + itemArray[pointer].Title;
        document.getElementById('itemQuantity').innerHTML="Quantity: " + itemArray[pointer].Quantity;
        document.getElementById('itemPrice').innerHTML="Price per unit: $" +itemArray[pointer].Price;
        
        });
});
 
// end of page before show code *************************************************************************

//
// end of add button events ************************************************************************

function createList() {
    var theList = document.getElementById("ItemListul");
    theList.innerHTML = "";

    $.get("/getAllItems", function(data, status){
        itemArray=data;
    
            itemArray.forEach(function (element,i) {  
                var li = document.createElement('li');
                li.classList.add('oneItem');
                li.setAttribute("data-parm",element.ID)
                li.innerHTML =  itemArray[i].ID + ":  " + element.Title + " " + element.Category;
                theList.appendChild(li)
            });

            var lilist= document.getElementsByClassName("oneItem");
            let newItemArray = Array.from(lilist);
            newItemArray.forEach(function (element,i){
                element.addEventListener('click',function(){
                    var parm = this.getAttribute("data-parm");
                    localStorage.setItem('parm',parm);

                    let stringItemArray= JSON.stringify(itemArray);
                    localStorage.setItem('itemArray',stringItemArray);
                    document.location.href="index.html#details";
                });
            });
    });
};

function createList1() {
    var theList = document.getElementById("costPage");
    theList.innerHTML = "";

    $.get("/getAllItems", function(data, status){
        itemArray=data;

            itemArray.forEach(function (element,i) {  
                var li = document.createElement('li');
                li.classList.add('oneItem');
                li.setAttribute("data-parm",element.ID)
                li.innerHTML =  itemArray[i].ID + ":  " + element.Title + " " + element.Quantity + " x $"+element.Price +" = $"+ element.TotalPrice;
                theList.appendChild(li)
            });

            var lilist= document.getElementsByClassName("oneItem");
            let newItemArray = Array.from(lilist);
            newItemArray.forEach(function (element,i){
                element.addEventListener('click',function(){
                    var parm = this.getAttribute("data-parm");
                    localStorage.setItem('parm',parm);
                });
            });
            let showPrice = document.getElementById("endPrice")
            showPrice.innerHTML = "The grand total for this shopping list is $" + getGrandTotal();

});

};

function deleteItem(which){
    console.log(which);
    //let arrayPointer= GetArrayPointer(which);
    //itemArray.splice(arrayPointer,1);

    $.ajax({
        type:"DELETE",
        url:"/DeleteItem/" + which,
        success: function(result){
            alert(result);
            document.location.href="index.html#ListAll";
        },
        error: function(xhr, textStatus, errorThrown){
            alert("Server could not delete Item with ID"+ which);
            document.location.href="index.html#ListAll";
        }
    });
}

function getGrandTotal(){
        let grandTotal = 0;
        let itemTotal;
        if(itemArray.length > 0)
    {
        for(let i = 0; i < itemArray.length; i++)
        {
            itemTotal = itemArray[i]['TotalPrice'];
            grandTotal = grandTotal + parseFloat(itemTotal);
        }
    }
        return grandTotal;
}
    
  

    function GetArrayPointer(localID) {
        for (let i = 0; i < itemArray.length; i++) {
            if (localID === itemArray[i].ID) {
                return i;
            }
        }
    }