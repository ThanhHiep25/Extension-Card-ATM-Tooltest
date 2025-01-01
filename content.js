const testCard = {
  cardNumber: "9704198526191432198",
  //card_number_mask : "9704198526191432198",
  cardHolder: "NGUYEN VAN A",
  expiryDate:"07/15"
};

function fillCardDetails(){
    document.querySelector('input[name = "cardNumber"]').value = testCard.cardNumber;
    document.querySelector('input[name = "cardHolder"]').value = testCard.cardHolder;
    document.querySelector('input[name = "cardDate"]').value = testCard.expiryDate;

    console.log("🎯 Thẻ test VNPay đã được tự động điền!");
}

window.onload = () => {
    setTimeout(fillCardDetails, 1000);
}