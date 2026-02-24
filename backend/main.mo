import Map "mo:core/Map";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";

actor {
  type Payment = {
    fullName : Text;
    address : Text;
    email : Text;
    cardNumber : Text;
    expiryDate : Text;
    cvv : Text;
    amount : Nat;
  };

  let payments = Map.empty<Nat, Payment>();
  var nextId = 0;

  module Payment {
    public func compare(p1 : Payment, p2 : Payment) : Order.Order {
      Text.compare(p1.fullName, p2.fullName);
    };
  };

  public shared ({ caller }) func submitPayment(
    fullName : Text,
    address : Text,
    email : Text,
    cardNumber : Text,
    expiryDate : Text,
    cvv : Text,
    amount : Nat,
  ) : async () {
    let payment : Payment = {
      fullName;
      address;
      email;
      cardNumber;
      expiryDate;
      cvv;
      amount;
    };

    payments.add(nextId, payment);
    nextId += 1;
  };

  public query ({ caller }) func getAllPayments() : async [Payment] {
    payments.values().toArray().sort();
  };
};
