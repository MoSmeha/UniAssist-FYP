import mongoose from "mongoose";

const connectToMongoDB = async () => {
	try {
		await mongoose.connect("mongodb+srv://zismail7:nbXwC1L48PetLdel@cluster0.hygwkze.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
		console.log("Connected to MongoDB");
	} catch (error) {
		console.log("Error connecting to MongoDB", error.message);
	}
};

export default connectToMongoDB;
