require("dotenv").config();

const config = require("./config.json");
const mongoose = require("mongoose");

mongoose.connect(config.connectionString);
const User = require("./model/user.model")
const Note = require("./model/note.model")
const Exercise = require("./model/exercise.model")
const ExerHistory = require("./model/exerciseHistory.model")
const Recipes = require("./model/recipes.mode")
const UserPinnedRecipes = require("./model/pinnedRecipes.model")
const RecipeCategory = require("./model/recipeCategory.model")
const LeaderBoard = require("./model/leaderboard.model")

const express = require("express");
const cors = require("cors");
const app = express();

const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./utilities");
const { tile, meshgrid } = require("@tensorflow/tfjs");
const exerciseHistoryModel = require("./model/exerciseHistory.model");

const multer = require("multer");
const cloudinary = require("./config/cloudinary"); // Import Cloudinary config
const { v4: uuidv4 } = require("uuid");

const storage = multer.memoryStorage();
const upload = multer({ storage });
app.use(express.json());

app.use(
    cors({
        origin: "*",
    })
)

app.post("/create-account", async (req, res) => {
    const { fullName, email, password } = req.body;
    const type = 0;
    if (!fullName) {
        return res
            .status(400)
            .json({ error: true, message: "Full Name is require" })
    }

    if (!email) {
        return res
            .status(400)
            .json({ error: true, message: "Email is require" })
    }

    if (!password) {
        return res
            .status(400)
            .json({ error: true, message: "Password is require" })
    }

    const isUser = await User.findOne({ email: email });

    if (isUser) {
        return res
            .status(400)
            .json({ error: true, message: "User already exist" })
    }

    const user = new User({
        fullName,
        email,
        password,
        type
    })

    await user.save();

    // const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
    //     expiresIn: "30m"
    // })

    return res
        .json({
            error: false,
            user,
            message: "Registration successful"
        })

})

app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email) {
        return res
            .status(400)
            .json({ error: true, message: "Email is require" })
    }

    if (!password) {
        return res
            .status(400)
            .json({ error: true, message: "Password is require" })
    }

    const userInfo = await User.findOne({ email: email });

    if (!userInfo) {
        return res
            .status(400)
            .json({ error: true, message: "User not found" })
    }

    if (userInfo.email == email && userInfo.password == password) {
        const user = { user: userInfo }
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: "36000m",
        })

        return res.json({
            error: false,
            message: "Login successful",
            email,
            accessToken
        })
    }
    else {
        return res
            .status(400)
            .json({
                error: true,
                message: "Invalid "
            })
    }

})

app.get("/get-user", authenticateToken, async (req, res) => {
    const { user } = req.user;

    const isUser = await User.findOne({ _id: user._id });

    if (!isUser) {
        return res.sendStatus(401);
    }

    return res.json({
        user: {
            fullName: isUser.fullName,
            email: isUser.email,
            _id: isUser._id,
            type: isUser.type,
            creatOn: isUser.createOn

        },
        message: ""
    })

});


app.post("/add-note", authenticateToken, async (req, res) => {
    const { title, content, tags } = req.body;
    const { user } = req.user

    if (!title) {
        return res
            .status(400)
            .json({ error: true, message: "Title is require" })
    }

    if (!content) {
        return res
            .status(400)
            .json({ error: true, message: "Content is require" })
    }

    try {
        const note = new Note({
            title,
            content,
            tags: tags || [],
            userId: user._id,

        });

        await note.save()

        return res.json({
            error: false,
            note,
            message: "Note added"
        });

    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Server error"
        })
    }

})

app.put("/edit-note/:noteId", authenticateToken, async (req, res) => {
    const noteId = req.params.noteId;
    const { title, content, tags, isPinned } = req.body;
    const { user } = req.user;

    if (!title && !content && !tags)
        return res
            .status(400)
            .json({
                error: true,
                message: "No changes"
            })

    try {
        const note = await Note.findOne({ _id: noteId });

        if (!note)
            return res
                .status(404)
                .json({
                    error: true,
                    message: "Note not found"
                })

        if (title) note.title = title;
        if (content) note.content = content;
        if (tags) note.tags = tags;
        if (isPinned) note.isPinned = isPinned;

        await note.save();

        return res.json({
            error: false,
            message: "Note updated"
        })

    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Internal Server Error"
        })
    }
});

app.get("/get-note/", authenticateToken, async (req, res) => {


    try {
        const notes = await Note.find().sort({ isPinned: -1 });

        return res.json({
            error: false,
            notes,
            message: "All notes retrieved successfully"
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Internal Server Error"
        });
    }

});

app.delete("/delete-note/:noteId", authenticateToken, async (req, res) => {

    const noteId = req.params.noteId;
    try {
        const note = await Note.findOne({ _id: noteId })
        if (!note) return res.status(404).json({ error: true, message: "Note not found" });
        await Note.deleteOne({ _id: noteId });

        return res.json({ error: false, message: "Note Deleted successful" })

    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Internal Server Error"
        })
    }
})

app.put("/update-note-pinned/:noteId", authenticateToken, async (req, res) => {

    const noteId = req.params.noteId;
    const { isPinned } = req.body;
    const { user } = req.user;

    try {
        const note = await Note.findOne({ _id: noteId });

        if (!note)
            return res
                .status(404)
                .json({
                    error: true,
                    message: "Note not found"
                })

        note.isPinned = isPinned;
        console.log(isPinned);

        await note.save();

        return res.json({
            error: false,
            message: "Note updated"
        })

    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Internal Server Error"
        })
    }
});

app.get("/", (req, res) => {
    res.json({ data: "hello" })
})

// admin

app.get("/get-all-user", authenticateToken, async (req, res) => {
    const { user } = req.user;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit; // Tính toán vị trí bắt đầu

    try {
        // Kiểm tra quyền người dùng
        if (user.type == 0) {
            return res.json({ error: true, message: "Do not have permit" });
        }

        // Lấy tất cả người dùng với phân trang
        const allUser = await User.find().skip(skip).limit(limit);

        // Lấy tổng số người dùng
        const totalCount = await User.countDocuments();

        // Trả về dữ liệu người dùng cùng với tổng số người dùng và thông tin phân trang
        return res.json({
            data: allUser,
            total: totalCount,
            page: page,
            limit: limit,
            totalPages: Math.ceil(totalCount / limit) // Tính tổng số trang
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        return res.sendStatus(500); // Lỗi server
    }
});


app.post("/add-user", async (req, res) => {
    const { fullName, email, password, type } = req.body;

    try {
        const isUser = await User.findOne({ email: email });

        if (isUser) {
            return res
                .status(400)
                .json({ error: true, message: "User already exist" })
        }

        const newUser = new User({ fullName, email, password, type });
        await newUser.save();
        return res.json({ message: "Add susscessful" });
    } catch (error) {
        res.status(400).json({ error: err.message });
    }

})

app.put("/edit-user/:id", async (req, res) => {
    const { fullName, email, password, type } = req.body;

    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { fullName, email, password, type },
            { new: true }
        );
        if (!updatedUser) return res.status(404).json({ message: "User not found" });
        res.json(updatedUser);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
})

app.delete("/delete-user/:id", async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        return res.json({ message: "User has been deleted" });;
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
})


// Thêm một bài tập mới
app.post("/add-exercise", async (req, res) => {
    const { category, levels } = req.body;

    try {
        // Tạo một bài tập mới
        const newExercise = new Exercise({ category, levels });
        const savedExercise = await newExercise.save();
        res.status(201).json(savedExercise);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


// Cập nhật một bài tập theo ID
app.put("/exercise/:id", async (req, res) => {
    const { category, levels } = req.body;

    try {
        const updatedExercise = await Exercise.findByIdAndUpdate(
            req.params.id,
            { category, levels },
            { new: true }
        );
        if (!updatedExercise) return res.status(404).json({ message: "Exercise not found" });
        res.json(updatedExercise);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


// Thêm một bài tập vào một cấp độ trong bài tập
app.post("/:id/add-exercise-to-level", async (req, res) => {
    const { level, name, gifUrl, duration, exerciseImg, reps, cal } = req.body;

    try {
        const exercise = await Exercise.findById(req.params.id);
        if (!exercise) return res.status(404).json({ message: "Exercise not found" });

        // Tìm cấp độ và thêm bài tập vào
        const levelIndex = exercise.levels.findIndex(l => l.level === level);
        if (levelIndex === -1) {
            return res.status(404).json({ message: "Level not found" });
        }

        // Thêm bài tập vào cấp độ
        exercise.levels[levelIndex].exercises.push({ name, gifUrl, duration, reps, cal });
        exercise.levels[levelIndex].exerciseImg = exerciseImg; // Cập nhật hình ảnh cấp độ
        await exercise.save();
        res.json(exercise);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


// Xóa bài tập trong cấp độ của bài tập
app.delete("/:id/remove-exercise-from-level/:level/:exerciseId", async (req, res) => {
    try {
        const exercise = await Exercise.findById(req.params.id);
        if (!exercise) return res.status(404).json({ message: "Exercise not found" });

        // Tìm cấp độ
        const levelIndex = exercise.levels.findIndex(l => l.level === req.params.level);
        if (levelIndex === -1) {
            return res.status(404).json({ message: "Level not found" });
        }

        // Xóa bài tập trong cấp độ
        exercise.levels[levelIndex].exercises = exercise.levels[levelIndex].exercises.filter(
            e => e._id.toString() !== req.params.exerciseId
        );

        await exercise.save();
        res.json(exercise);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


app.get("/get-exercise", async (req, res) => {
    try {
        const exercises = await Exercise.find(); // Lấy tất cả bài tập
        res.json(exercises);
    } catch (err) {
        res.status(500).json({ message: "Error retrieving exercises", error: err });
    }
});


// EXERCISE HISTORY

app.post("/add-exercise-history", async (req, res) => {
    const { userId, date, exercises } = req.body;

    try {
        const exerHistory = new ExerHistory({
            userId,
            date,
            exercises
        });
        await exerHistory.save();

        res.status(201).json({
            message: "Exercise saved successfully!",
            data: exerHistory
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.get("/exercise-history/:userId", async (req, res) => {
    const { userId, date } = req.params;

    try {
        const exerHistorys = await ExerHistory.find({
            userId
        });

        if (!exerHistorys) {
            return res.status(404).json({ message: "No exercises found for this date." });
        }

        res.json(exerHistorys);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get("/exercise-weekly/:userId", async (req, res) => {
    const { userId } = req.params;

    try {
        const today = new Date();
        const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
        const endOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 6));

        const exercises = await ExerHistory.find({
            userId,
            date: {
                $gte: startOfWeek,
                $lte: endOfWeek,
            },
        });

        if (!exercises) {
            return res.status(404).json({ message: "No exercises found for this week." });
        }

        res.json(exercises);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/exercise-monthly/:userId', async (req, res) => {
    const { userId } = req.params;
    const currentDay = new Date().getDate(); // Tháng hiện tại (0 - 11)
    const currentMonth = new Date().getMonth(); // Tháng hiện tại (0 - 11)
    const currentYear = new Date().getFullYear(); // Năm hiện tại



    try {
        // Lấy tất cả bài tập của người dùng trong tháng hiện tại
        const startOfMonth = new Date(Date.UTC(currentYear, currentMonth, 1, 0, 0, 0)); // Ngày 1, 00:00:00 UTC
        const endOfMonth = new Date(Date.UTC(currentYear, currentMonth, currentDay + 1, 0, 0, 0)); // Ngày 1 của tháng sau, 00:00:00 UTC
        console.log(startOfMonth)
        console.log(endOfMonth)
        const exercises = await ExerHistory.find({
            userId: userId,
            date: {
                $gte: startOfMonth, // Từ ngày 1 của tháng hiện tại
                $lt: endOfMonth     // Trước ngày 1 của tháng tiếp theo
            }
        });
        console.log(exercises)

        // Tổng hợp dữ liệu theo từng ngày trong tháng
        const monthlyData = Array.from({ length: currentDay }, (_, i) => ({
            day: i + 1,       // Ngày trong tháng
            duration: 0,      // Thời gian mặc định
            calories: 0       // Calories mặc định
        }));

        exercises.forEach((exercise) => {
            const day = new Date(exercise.date).getDate() - 1; // Lấy ngày trong tháng (0-30)

            exercise.exercises.forEach((ex) => {
                monthlyData[day].duration += ex.duration || 0; // Cộng dồn thời gian
                monthlyData[day].calories += ex.cal || 0;      // Cộng dồn calories (nếu có)
            });
        });


        res.json({ data: monthlyData });
    } catch (err) {
        console.error('Error fetching monthly exercises:', err);
        res.status(500).json({ message: 'Server error' });
    }
});




// Recipes 

app.get("/get-recipe-byId", async (req, res) => {
    const { category, userId } = req.query;

    try {

        if (category) {
            const recipe = await Recipes.find({ category }); 
            const pinnedRecipes = await UserPinnedRecipes.find({ userId: userId });

            // Tạo map để tra cứu nhanh trạng thái pin
            const pinnedMap = pinnedRecipes.reduce((map, item) => {
                map[item.recipeId] = item.isPinned;
                return map;
            }, {});
    
            // Kết hợp recipe với trạng thái pin
            const response = recipe.map((recipe) => ({
                ...recipe.toObject(),
                isPinned: pinnedMap[recipe._id] || false, // Nếu không pin thì mặc định false
            }));
            return res.json(response);
        }

    } catch (error) {
        console.error("Error fetching meals:", error);
        return res.status(500).json({ message: "Error fetching meals" });
    }
});
app.post("/add-recipe", async (req, res) => {
    const { title, image, category, time, content } = req.body;

    try {
        const recipes = new Recipes({ title, image, category, time, content });
        await recipes.save();
        res.status(201).json({
            message: "Recipes saved successfully!",
            data: recipes
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get("/get-all-recipe", async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit; // Tính toán vị trí bắt đầu

    try {
        const allRecipes = await Recipes.find().skip(skip).limit(limit);

        // Lấy tổng số người dùng
        const totalCount = await Recipes.countDocuments();

        // Trả về dữ liệu người dùng cùng với tổng số người dùng và thông tin phân trang
        return res.json({
            data: allRecipes,
            total: totalCount,
            page: page,
            limit: limit,
            totalPages: Math.ceil(totalCount / limit) // Tính tổng số trang
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        return res.sendStatus(500); // Lỗi server
    }
});


app.put("/edit-recipe/:id", async (req, res) => {
    const { title, image, category, time, content } = req.body;

    try {
        const updatedRecipe = await Recipes.findByIdAndUpdate(
            req.params.id,
            { title, image, category, time, content },
            { new: true }
        );
        if (!updatedRecipe) return res.status(404).json({ message: "Recipe not found" });
        res.json(updatedRecipe);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
})

app.delete("/delete-recipe/:id", async (req, res) => {
    try {
        await Recipes.findByIdAndDelete(req.params.id);
        return res.json({ message: "User has been deleted" });;
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
})

app.get("/user-recipes", async (req, res) => {
    const userId = req.query.userId; // Lấy userId từ query parameter
    const recipeId = req.query.recipeId; // Lấy recipeId từ query parameter (nếu có)

    if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
    }

    try {
        // Truy vấn danh sách công thức dựa trên recipeId (nếu được cung cấp)
        const recipesQuery = recipeId ? { _id: recipeId } : {};
        const recipes = await Recipes.find(recipesQuery);

        // Truy vấn trạng thái pin của user từ bảng UserPinnedRecipes
        const pinnedRecipes = await UserPinnedRecipes.find({ 
            userId: userId,
            ...(recipeId && { recipeId: recipeId }), // Nếu có recipeId thì thêm điều kiện
        });

        // Tạo map để tra cứu nhanh trạng thái pin
        const pinnedMap = pinnedRecipes.reduce((map, item) => {
            map[item.recipeId.toString()] = item.isPinned;
            return map;
        }, {});

        // Kết hợp dữ liệu recipe với trạng thái pin
        const response = recipes.map((recipe) => ({
            ...recipe.toObject(),
            isPinned: pinnedMap[recipe._id.toString()] || false, // Nếu không có, mặc định là false
        }));

        res.status(200).json(response);
    } catch (error) {
        console.error("Error fetching user recipes:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

app.get("/pinned-recipes", async (req, res) => {
    const userId = req.query.userId; // Lấy userId từ query parameter

    if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
    }

    try {
        // Lấy danh sách các recipeId có isPinned = true cho userId
        const pinnedRecipes = await UserPinnedRecipes.find({
            userId: userId,
            isPinned: true,
        }).select("recipeId isPinned"); // Lấy cả recipeId và isPinned

        // Tạo map để tra cứu trạng thái pin
        const pinnedMap = pinnedRecipes.reduce((map, item) => {
            map[item.recipeId] = item.isPinned;
            return map;
        }, {});

        // Lấy danh sách recipeId
        const pinnedRecipeIds = pinnedRecipes.map((item) => item.recipeId);

        // Lọc danh sách recipes theo recipeId
        const recipes = await Recipes.find({ _id: { $in: pinnedRecipeIds } });

        // Kết hợp recipe với trạng thái pin
        const response = recipes.map((recipe) => ({
            ...recipe.toObject(),
            isPinned: pinnedMap[recipe._id] || false, // Gắn trạng thái isPinned
        }));

        // Trả về kết quả
        res.status(200).json(response);
    } catch (error) {
        console.error("Error fetching pinned recipes:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});




app.post("/pin-recipe", async (req, res) => {
    const { userId, recipeId, isPinned } = req.body;

    if (!userId || !recipeId) {
        return res.status(400).json({ message: "User ID and Recipe ID are required" });
    }

    try {
        // Check if the record exists
        const existingPin = await UserPinnedRecipes.findOne({ userId, recipeId });

        if (existingPin) {
            // Update pin status
            existingPin.isPinned = isPinned;
            await existingPin.save();
        } else {
            // Create new record
            await UserPinnedRecipes.create({ userId, recipeId, isPinned });
        }

        res.status(200).json({ message: "Pin status updated successfully" });
    } catch (error) {
        console.error("Error updating pin status:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


app.get("/get-category-recipe", async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit; // Tính toán vị trí bắt đầu

    try {
        const allCategory = await RecipeCategory.find().skip(skip).limit(limit);

        // Lấy tổng số người dùng
        const totalCount = await RecipeCategory.countDocuments();

        // Trả về dữ liệu người dùng cùng với tổng số người dùng và thông tin phân trang
        return res.json({
            data: allCategory,
            total: totalCount,
            page: page,
            limit: limit,
            totalPages: Math.ceil(totalCount / limit) // Tính tổng số trang
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        return res.sendStatus(500); // Lỗi server
    }
});


app.post("/add-recipe-category", async (req, res) => {
    const { categoryName } = req.body;

    try {
        const isCategory = await RecipeCategory.findOne({ categoryName: categoryName });

        if (isCategory) {
            return res
                .status(400)
                .json({ error: true, message: "Category already exist" })
        }

        const newCategory = new RecipeCategory({ categoryName });
        await newCategory.save();
        return res.json({ message: "Add susscessful" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }

})

app.put("/edit-recipe-category/:id", async (req, res) => {
    const { categoryName } = req.body;

    try {
        const updatedCategory = await RecipeCategory.findByIdAndUpdate(
            req.params.id,
            { categoryName },
            { new: true }
        );
        if (!updatedCategory) return res.status(404).json({ message: "User not found" });
        res.json(updatedCategory);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
})

app.delete("/delete-recipe-category/:id", async (req, res) => {
    try {
        await RecipeCategory.findByIdAndDelete(req.params.id);
        return res.json({ message: " Has been deleted" });;
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
})

app.post("/save-challenge", async (req, res) => {
    const { userId, reps, type } = req.body;

    try {

        const isData = await LeaderBoard.findOne({ userId, type });

        if (isData) {
            // Nếu bản ghi tồn tại, cập nhật reps
            isData.reps = reps;
            await isData.save();
        } else {
            // Nếu bản ghi không tồn tại, thêm mới
            const newRecord = new LeaderBoard({ userId, reps, type });
            await newRecord.save();
        }

        return res.json({ message: "Save susscessful" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }

})

app.get("/get-challenge-data", async (req, res) => {
    try {
        // Fetch top 5 pushup challenge records with unique userId sorted by reps in descending order
        const pushupData = await LeaderBoard.aggregate([
            { $match: { type: "pushup" } }, // Match only pushup type records
            { $sort: { maxReps: -1 } }, // Sort by max reps in descending order
            { $limit: 5 } // Limit to top 5
        ]);

        // Use populate to fetch the fullName for each userId and select only the fullName
        const pushupDataWithUserName = await User.populate(pushupData, {
            path: "userId", // The field to populate (userId from LeaderBoard)
            select: "fullName" // Only select the fullName field
        });

        // Fetch top 5 squat challenge records with unique userId sorted by reps in descending order
        const squatData = await LeaderBoard.aggregate([
            { $match: { type: "squat" } }, // Match only squat type records
            { $sort: { maxReps: -1 } }, // Sort by max reps in descending order
            { $limit: 5 } // Limit to top 5
        ]);

        // Use populate to fetch the fullName for each userId and select only the fullName
        const squatDataWithUserName = await User.populate(squatData, {
            path: "userId", // The field to populate (userId from LeaderBoard)
            select: "fullName" // Only select the fullName field
        });

        return res.json({
            error: false,
            pushupData: pushupDataWithUserName.map(record => ({
                user: record.userId, // Use the userId (which is the _id field from User model)
                reps: record.reps,
                fullName: record.fullName, // Include the fullName of the user
                type: record.type // Include the type (pushup)
            })),
            squatData: squatDataWithUserName.map(record => ({
                user: record.userId, // Use the userId (which is the _id field from User model)
                reps: record.reps,
                fullName: record.fullName, // Include the fullName of the user
                type: record.type // Include the type (squat)
            })),
            message: "Leaderboard data retrieved successfully"
        });

    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Internal Server Error"
        });
    }
});


app.post("/get-my-challenge-data/:userId", async (req, res) => {

})

app.get("/get-categories", async (req, res) => {
    try {
        const categories = await RecipeCategory.find();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch categories", error });
    }
});



app.listen(8000);
module.exports = app

