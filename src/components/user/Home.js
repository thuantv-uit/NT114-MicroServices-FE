function Home() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '6em' }}>
      <div style={{ width: '380px', padding: '1em', boxShadow: '0px 4px 10px rgba(0,0,0,0.1)', borderRadius: '8px', backgroundColor: '#fff' }}>
        {/* Header với avatar và icon */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1em', marginBottom: '1em' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#1976d2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
            🔒
          </div>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#1976d2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
            T
          </div>
        </div>

        {/* Tiêu đề */}
        <div style={{ textAlign: 'center', marginBottom: '1em' }}>
          <h1 style={{ fontSize: '1.5em', color: '#333' }}>Chào mừng đến với Dịch vụ Người dùng</h1>
        </div>

        {/* Nội dung */}
        <div style={{ textAlign: 'center', marginBottom: '1em' }}>
          <p style={{ color: '#555' }}>Hãy đăng nhập hoặc đăng ký để tiếp tục.</p>
        </div>

        {/* Nút điều hướng */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1em', marginBottom: '1em' }}>
          <a href="/login" style={{ padding: '0.8em 1.5em', backgroundColor: '#1976d2', color: '#fff', borderRadius: '4px', textDecoration: 'none' }}>
            Đăng nhập
          </a>
          <a href="/register" style={{ padding: '0.8em 1.5em', backgroundColor: '#ffbb39', color: '#fff', borderRadius: '4px', textDecoration: 'none' }}>
            Đăng ký
          </a>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', color: '#757575', marginTop: '2em' }}>
          Author: Thuan Tran
        </div>
      </div>
    </div>
  );
}

export default Home;