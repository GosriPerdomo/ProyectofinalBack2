// dto/userDTO.js
class UserDTO {
  constructor(user) {
    this.id = user._id;
    this.first_name = user.first_name;
    this.last_name = user.last_name;
    this.email = user.email;
    this.age = user.age;
    this.cart = user.cart;  // Referencia al carrito
    this.role = user.role;
  }
}

module.exports = UserDTO;

  