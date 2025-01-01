// Load danh sách thẻ từ storage khi popup mở
document.addEventListener("DOMContentLoaded", () => {
    loadSavedCards();
  });
  
  // Hàm kiểm tra dữ liệu hợp lệ
  function validateCard(cardNumber, cardHolder, cardDate) {
    const cardNumberPattern = /^\d{16,19}$/; // 16-19 chữ số
    const cardDatePattern = /^(0[1-9]|1[0-2])\/\d{2}$/; // MM/YY
  
    if (!cardNumberPattern.test(cardNumber)) {
      alert("❌ Số thẻ không hợp lệ! Vui lòng nhập 16-19 chữ số.");
      return false;
    }
  
    if (!cardDatePattern.test(cardDate)) {
      alert("❌ Ngày hết hạn không hợp lệ! Định dạng đúng: MM/YY.");
      return false;
    }
  
    if (!cardHolder.trim()) {
      alert("❌ Tên chủ thẻ không được để trống!");
      return false;
    }
  
    return true;
  }
  
  // Sự kiện khi người dùng chọn thẻ từ select
  document.getElementById('cardSelect').addEventListener('change', (event) => {
    const selectedIndex = event.target.value;
  
    if (selectedIndex === "") {
      document.getElementById('cardNumber').value = '';
      document.getElementById('cardHolder').value = '';
      document.getElementById('cardDate').value = '';
      return;
    }
  
    chrome.storage.sync.get({ cards: [] }, (data) => {
      const selectedCard = data.cards[selectedIndex];
      if (selectedCard) {
        document.getElementById('cardNumber').value = selectedCard.cardNumber;
        document.getElementById('cardHolder').value = selectedCard.cardHolder;
        document.getElementById('cardDate').value = selectedCard.cardDate;
      }
    });
  });
  
  // Nút cập nhật thông tin thẻ
  document.getElementById('updateCard').addEventListener('click', () => {
    const selectedIndex = document.getElementById('cardSelect').value;
  
    if (selectedIndex === "") {
      alert("❌ Vui lòng chọn một thẻ để cập nhật!");
      return;
    }
  
    chrome.storage.sync.get({ cards: [] }, (data) => {
      const cards = data.cards;
      cards[selectedIndex] = {
        cardNumber: document.getElementById('cardNumber').value,
        cardHolder: document.getElementById('cardHolder').value,
        cardDate: document.getElementById('cardDate').value,
      };
  
      chrome.storage.sync.set({ cards }, () => {
        alert('✅ Thông tin thẻ đã được cập nhật!');
        loadSavedCards();
      });
    });
  });
  
  // Lưu thẻ mới
  document.getElementById("saveCard").addEventListener("click", () => {
    const cardNumber = document.getElementById("cardNumber").value;
    const cardHolder = document.getElementById("cardHolder").value;
    const cardDate = document.getElementById("cardDate").value;
  
    if (!validateCard(cardNumber, cardHolder, cardDate)) {
      return;
    }
  
    chrome.storage.sync.get({ cards: [] }, (data) => {
      const cards = data.cards;
      cards.push({ cardNumber, cardHolder, cardDate });
      chrome.storage.sync.set({ cards }, () => {
        alert("✅ Thẻ đã được lưu thành công!");
        loadSavedCards();
        document.getElementById("cardNumber").value = "";
        document.getElementById("cardHolder").value = "";
        document.getElementById("cardDate").value = "";
      });
    });
  });
  
  // Tải danh sách thẻ vào dropdown
  function loadSavedCards() {
    chrome.storage.sync.get({ cards: [] }, (data) => {
      const cardSelect = document.getElementById("cardSelect");
      cardSelect.innerHTML = '<option value="">-- Chọn Thẻ Đã Lưu --</option>';
      data.cards.forEach((card, index) => {
        const option = document.createElement("option");
        option.value = index; // Sử dụng index để xác định thẻ
        option.textContent = `Thẻ ${index + 1}: ${card.cardHolder}`;
        cardSelect.appendChild(option);
      });
    });
  }
  
  // Xoá thẻ đã chọn
  document.getElementById("deleteCard").addEventListener("click", () => {
    const selectedIndex = document.getElementById("cardSelect").value;
  
    if (selectedIndex === "") {
      alert("❌ Vui lòng chọn một thẻ để xoá!");
      return;
    }
  
    chrome.storage.sync.get({ cards: [] }, (data) => {
      const cards = data.cards;
      cards.splice(selectedIndex, 1); // Xoá thẻ theo index
      chrome.storage.sync.set({ cards }, () => {
        alert("🗑️ Thẻ đã được xoá thành công!");
        loadSavedCards();
        document.getElementById('cardNumber').value = '';
        document.getElementById('cardHolder').value = '';
        document.getElementById('cardDate').value = '';
      });
    });
  });
  
  // Tự động điền thẻ đã chọn
  document.getElementById("fillCard").addEventListener("click", () => {
    const selectedIndex = document.getElementById("cardSelect").value;
  
    if (selectedIndex === "") {
      alert("❌ Vui lòng chọn một thẻ để điền!");
      return;
    }
  
    chrome.storage.sync.get({ cards: [] }, (data) => {
      const selectedCard = data.cards[selectedIndex];
      if (!selectedCard) {
        alert("❌ Thẻ không tồn tại!");
        return;
      }
  
      const { cardNumber, cardHolder, cardDate } = selectedCard;
  
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          func: (cardNumber, cardHolder, cardDate) => {
            document.querySelector('input[name="cardNumber"]').value = cardNumber;
            document.querySelector('input[name="cardHolder"]').value = cardHolder;
            document.querySelector('input[name="cardDate"]').value = cardDate;
            console.log("🎯 Thẻ test VNPay đã được tự động điền!");
          },
          args: [cardNumber, cardHolder, cardDate],
        });
      });
    });
  });
  