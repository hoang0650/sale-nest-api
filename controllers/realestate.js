const {RealEstate} = require('../models/realestate');

// Get all videos (including German lessons)
async function createRealestate (req, res) {
    try {
        const { userId, ...realEstateData } = req.body;
    
        const realEstate = new RealEstate({
          ...realEstateData,
          user: mongoose.Types.ObjectId(userId) // Chuyển đổi ID người dùng thành ObjectId
        });
    
        await realEstate.save();
    
        res.json(realEstate);
      } catch (error) {
        res.status(500).json({ error: 'Không thể tạo bất động sản' });
      }
}

async function getRealestates (req, res) {
    try {
        const realEstates = await RealEstate.find();
        res.json(realEstates);
      } catch (error) {
        res.status(500).json({ error: 'Không thể lấy danh sách bất động sản' });
    }
}

async function getRealestateId (req, res) {
    try {
        const realEstate = await RealEstate.findById(req.params.id).populate('user', 'id email role');
        if (realEstate) {
          res.json(realEstate);
        } else {
          res.status(404).json({ error: 'Không tìm thấy bất động sản' });
        }
      } catch (error) {
        res.status(500).json({ error: 'Không thể lấy thông tin bất động sản' });
      }
}

async function updateRealestate (req, res) {
    try {
        const realEstate = await RealEstate.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (realEstate) {
          res.json(realEstate);
        } else {
          res.status(404).json({ error: 'Không tìm thấy bất động sản' });
        }
      } catch (error) {
        res.status(500).json({ error: 'Không thể cập nhật bất động sản' });
    }
}

async function deleteRealestate (req, res) {
    try {
        await RealEstate.findByIdAndDelete(req.params.id);
        res.json({ message: 'Đã xóa bất động sản thành công' });
      } catch (error) {
        res.status(500).json({ error: 'Không thể xóa bất động sản' });
    }
}

async function getRealestateByRole (req, res) {
    try {
        const { role } = req.params;
        let realEstates;
    
        switch (role.toUpperCase()) {
          case 'USER':
            realEstates = await RealEstate.find().populate('user', 'id email role').where('user.role').equals('USER');
            break;
          case 'AGENT':
            realEstates = await RealEstate.find().populate('user', 'id email role').where('user.role').equals('AGENT');
            break;
          case 'ADMIN':
            realEstates = await RealEstate.find().populate('user', 'id email role');
            break;
          default:
            return res.status(400).json({ error: 'Role không hợp lệ' });
        }
    
        res.json(realEstates);
      } catch (error) {
        res.status(500).json({ error: 'Không thể lấy danh sách bất động sản theo role' });
      }
}

module.exports = {createRealestate,getRealestates,getRealestateId,updateRealestate,deleteRealestate,getRealestateByRole}