import { useState } from "react";
import SearchInput from "./SearchInput";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    // This 'balance' property means that if it's NEGATIVE value that means YOU owe your friend. In this case, YOU owe Clark 7 (EUROS)
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    // This 'balance' property means that if it's POSITIVE value that means the FRIEND owe YOU. In this case, SARAH owe YOU 20 (EUROS)
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [friends, setFriends] = useState(initialFriends);
  const [showAddFriend, setShowFriend] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);

  const handleAddFriend = () => {
    setShowFriend((showAddFriend) => !showAddFriend);
  };

  const handleAddFriendToList = (friend) => {
    setFriends((friends) => [...friends, friend]);
  };

  // This function will be called whenever we click on the 'select' button. Whatever button is clicked, the associated friend object will be set as the current selected!
  const handleSelection = (friend) => {
    setSelectedFriend((selected) =>
      selected?.id === friend.id ? null : friend
    );
    setShowFriend(false);
  };

  const handleSplitBill = (value) => {
    // This is how we update an object in an array!
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );

    setSelectedFriend(null);
  };

  return (
    <div className="app">
      <SearchInput />
      <div className="sidebar">
        <FriendsList
          friends={friends}
          onSelection={handleSelection}
          selectedFriend={selectedFriend}
        />

        {showAddFriend && <FormAddFriend onAddFriend={handleAddFriendToList} />}

        <Button onClick={handleAddFriend}>
          {showAddFriend ? "Close" : "Add Friend"}
        </Button>
      </div>

      {selectedFriend && (
        <FormSplitBill
          selectedFriend={selectedFriend}
          onSplitBill={handleSplitBill}
        />
      )}
    </div>
  );
}

function FriendsList({ friends, onSelection, selectedFriend }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          onSelection={onSelection}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onSelection, selectedFriend }) {
  const isSelected = selectedFriend?.id === friend.id;

  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>

      {/* Made 3 conditions since the ternary operator only allows 2 conditions not 3! We could've used nested ternary but it's NOT recommeneded! */}
      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} {Math.abs(friend.balance)}€
        </p>
      )}

      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you {Math.abs(friend.balance)}€
        </p>
      )}

      {friend.balance === 0 && <p>You and {friend.name} are even!</p>}

      <Button onClick={() => onSelection(friend)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function Button({ children, onClick }) {
  return (
    <button onClick={onClick} className="button">
      {children}
    </button>
  );
}

function FormAddFriend({ onAddFriend }) {
  const [friendName, setFriendName] = useState("");
  const [friendImage, setFriendImage] = useState("https://i.pravatar.cc/48");

  const handleFriendName = (e) => {
    setFriendName(e.target.value);
  };

  const handleFriendImage = (e) => {
    setFriendImage(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!friendName || !friendImage) {
      return;
    }

    const id = crypto.randomUUID();
    const newFriend = {
      name: friendName,
      image: `${friendImage}?=${id}`,
      balance: 0,
      id,
    };

    setFriendName("");
    setFriendImage("https://i.pravatar.cc/48");

    onAddFriend(newFriend);
  };

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>👭 Friend name</label>
      <input type="text" value={friendName} onChange={handleFriendName} />

      <label>🌆 Image URL</label>
      <input type="text" value={friendImage} onChange={handleFriendImage} />

      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ selectedFriend, onSplitBill }) {
  const [bill, setBill] = useState("");
  const [expense, setExpense] = useState("");
  const [whoIsPaying, setWhoIsPaying] = useState("user");
  // Dervied State. Based on the bill's and expense's state
  const paidByFriend = bill ? bill - expense : "";

  const handleBill = (e) => {
    setBill(Number(e.target.value));
  };

  const handleExpense = (e) => {
    // This condition is to make sure the user can't type a value that is bigger than the bill itself because it will give us negative number!
    setExpense(
      Number(e.target.value) > bill ? expense : Number(e.target.value)
    );
  };

  const handleWhoIsPaying = (e) => {
    setWhoIsPaying(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // In case one of the inputs are empty, you cannot submit!
    if (!bill || !expense) return;

    onSplitBill(whoIsPaying === "user" ? paidByFriend : -expense);
  };

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill with {selectedFriend.name}</h2>

      <label>💶 Bill value</label>
      <input type="text" value={bill} onChange={handleBill} />

      <label>🙎‍♂️ Your expense</label>
      <input type="text" value={expense} onChange={handleExpense} />

      <label>👭 {selectedFriend.name}'s expense</label>
      <input type="text" disabled value={paidByFriend} />

      <label>🤑 Who is paying the bill</label>
      <select value={whoIsPaying} onChange={handleWhoIsPaying}>
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>

      <Button>Split bill</Button>
    </form>
  );
}
