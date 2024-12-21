import React, { useState, useEffect } from 'react';
import { IoMdClose } from "react-icons/io";
import { FaMinus } from "react-icons/fa";



const EditModal = ({ showEditModal,updateUIAfterAPICall,updateUIAfterDelete, closeEditModal , selectedBox ,apiUpdateBox ,deleteBox  }) => {
    const URL = process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : "https://airbnb-clone-64cu.onrender.com";

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [image, setImage] = useState("");
    const [items, setItems] = useState([]);

    const [itemsInput, setItemsInput] = useState('');


    useEffect(() => {
        if (selectedBox) {
            setName(selectedBox.name);
            setDescription(selectedBox.description);
            setPrice(selectedBox.price);
            setItems(selectedBox.items);
        }
    }, [selectedBox]);


    const handleItemsChange = (event) => {
        setItemsInput(event.target.value);
    };

    const handlePriceChange = (event) => {
        setPrice(event.target.value);
    };

    const handleNameChange = (event) => {
        setName(event.target.value);
    };

    const handleApplyItems = () => {
        if (itemsInput.trim() !== '') {
            setItems([...items, itemsInput.trim()]); // Add the new coupon to the array
            setItemsInput(''); // Clear the input field
        }

    };


    const handleDeleteItems = (indexToDelete) => {
        setItems(items.filter((_, index) => index !== indexToDelete));
      };



    useEffect(() => {
        // Log the updated coupons list every time it changes
        console.log('Updated coupons:', items);

        console.log("im the edit box ", selectedBox);
    }, [items]);


    const handleUpdateBox = async () => {
        try {
            const updatedBox = {
                id: selectedBox._id,
                name,
                description,
                price,
                items
            };
            const updatedbox =  await apiUpdateBox(selectedBox._id, updatedBox);
               // Handle the response (if needed)
             console.log('Box updtaed:', updatedbox);


            // Call the UI update function with the updated box data
            updateUIAfterAPICall(updatedbox);
            // Close the modal after successful update
            closeEditModal();
        } catch (error) {
            console.error("Error updating box:", error);
        }
    };

    
    const handleDeleteBox = async () => {
        try {
            const confirmed = window.confirm(`Are you sure you want to delete the box: ${name}?`);
            if (!confirmed) return;

            await deleteBox(selectedBox._id);
            updateUIAfterDelete(selectedBox._id);
            closeEditModal();
        } catch (error) {
            console.error("Error deleting box:", error);
        }
    };

    return (
        <section className="modal container">


            <div className={`modal__container ${showEditModal ? 'show-modal' : ''}`} id="modal-container">
                <div className="modal__content ">
                    <div className="modal__close close-modal" onClick={closeEditModal} >
                        <IoMdClose size={20} />
                    </div>
                    <div className="master-container">
                        <div className="card-modal cart ">
                            <label className="title">Your cart</label>
                            <div className="top">
                                <input value={ name} onChange={handleNameChange} type="text" placeholder="add box name" className="input_field" />
                                <input value={ price} onChange={handlePriceChange}  type="text" placeholder="€ price" className="input_field" />
                            </div>
                        </div>

                        <div className="card-modal coupons">
                            <label className="title">Apply coupons</label>
                            <div className="form"  >
                                <input type="text" name="coupon" value={ itemsInput} onChange={handleItemsChange} placeholder="Apply your coupons here" className="input_field" />
                                <div className='btn' onClick={handleApplyItems} >Apply</div>
                            </div>
                        </div>

                        <div className="card-modal checkout">
                            <label className="title">Checkout</label>
                            <div className="details">


                                {items.map((item, index) => (
                        
                                    <div key={index} className="item">
                                    <span >{item}</span>
                                        <FaMinus className='delete' size={10} onClick={()=>{
                                            handleDeleteItems(index)
                                        }} />
                                    </div>
                                    

                              
                                ))}


                            </div>
                            <div onClick={handleUpdateBox} className="checkout--footer">
                                <div  className="checkout-btn">update</div>
                            </div>
                            <div onClick={handleDeleteBox} className="checkout--footer">
                                <div  className="checkout-btn">delete</div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

        </section>
    )
}

export default EditModal