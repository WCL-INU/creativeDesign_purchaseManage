const pool = require('../config/database');

// 특정 프로젝트의 팀 리스트 조회
exports.getTeamsByProject = async (projectId) => {
  try {
    const [rows] = await pool.query(
      `
      SELECT t.teamId, t.name, t.personnel, c.name AS courseName
      FROM Team t
      JOIN Course c ON t.courseId = c.courseId
      WHERE t.projectId = ?
      `,
      [projectId]
    );
    return rows;
  } catch (err) {
    console.error('Database query error:', err);
    throw err;
  }
};

// 특정 팀의 멤버 조회
exports.getTeamMembers = async (teamId) => {
  try {
    const [rows] = await pool.query(
      `
      SELECT m.memberId, m.name, m.major
      FROM TeamMember tm
      JOIN Member m ON tm.studentId = m.memberId
      WHERE tm.teamId = ?
      `,
      [teamId]
    );
    return rows;
  } catch (err) {
    console.error('Database query error:', err);
    throw err;
  }
};

// 특정 팀의 구매 기록 조회
exports.getPurchaseRecords = async (teamId) => {
  try {
    const [rows] = await pool.query(
      `
      SELECT pr.purchaseRecordId, pr.remainBudget, pr.status, pr.updateDateTime, rp.itemName
      FROM PurchaseRecord pr
      LEFT JOIN RequestPurchase rp ON pr.requestPurchaseId = rp.requestPurchaseId
      WHERE pr.teamId = ?
      `,
      [teamId]
    );
    return rows;
  } catch (err) {
    console.error('Database query error:', err);
    throw err;
  }
};

// 모든 코스 목록 가져오기
exports.getCourses = async () => {
  const query = `SELECT courseId, name FROM Course`;
  const [rows] = await pool.query(query);
  return rows;
};

// 모든 프로젝트 목록 가져오기
exports.getProjects = async () => {
  const query = `SELECT projectId, name FROM Project`;
  const [rows] = await pool.query(query);
  return rows;
};

// 새로운 팀 추가
exports.insertTeam = async (name, personnel, courseId, projectId) => {
  const query = `
    INSERT INTO Team (name, personnel, courseId, projectId) 
    VALUES (?, ?, ?, ?)
  `;
  await pool.query(query, [name, personnel, courseId, projectId]);
};