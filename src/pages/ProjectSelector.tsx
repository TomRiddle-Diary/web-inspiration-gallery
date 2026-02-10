import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, Project } from '../api';

export default function ProjectSelector() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    clientName: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const data = await api.getAllProjects();
      setProjects(data);
    } catch (error) {
      console.error('Failed to load projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newProject.name.trim()) {
      alert('プロジェクト名を入力してください');
      return;
    }

    try {
      const created = await api.createProject(
        newProject.name,
        newProject.description || undefined,
        newProject.clientName || undefined
      );
      
      // Navigate to the newly created project
      navigate(`/project/${created.id}`);
    } catch (error) {
      console.error('Failed to create project:', error);
      alert('プロジェクトの作成に失敗しました');
    }
  };

  const handleSelectProject = (projectId: string) => {
    navigate(`/project/${projectId}`);
  };

  const handleDeleteProject = async (projectId: string, projectName: string) => {
    if (!confirm(`プロジェクト "${projectName}" を削除しますか？\nこのプロジェクトのウェブサイトも削除されます。`)) {
      return;
    }

    try {
      await api.deleteProject(projectId);
      await loadProjects();
    } catch (error) {
      console.error('Failed to delete project:', error);
      alert('プロジェクトの削除に失敗しました');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-gray-600">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            インスピレーション管理
          </h1>
          <p className="text-lg text-gray-600">
            プロジェクトを選択するか、新しいプロジェクトを作成してください
          </p>
        </div>

        <div className="mb-8 flex justify-center">
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            {showCreateForm ? 'キャンセル' : '+ 新しいプロジェクト'}
          </button>
        </div>

        {showCreateForm && (
          <div className="max-w-2xl mx-auto mb-12 bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              新しいプロジェクト
            </h2>
            <form onSubmit={handleCreateProject} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  プロジェクト名 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  placeholder="例: ECサイトリニューアル"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  required
                />
              </div>

              <div>
                <label htmlFor="clientName" className="block text-sm font-medium text-gray-700 mb-2">
                  クライアント名
                </label>
                <input
                  type="text"
                  id="clientName"
                  value={newProject.clientName}
                  onChange={(e) => setNewProject({ ...newProject, clientName: e.target.value })}
                  placeholder="例: 株式会社サンプル"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  説明
                </label>
                <textarea
                  id="description"
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  placeholder="プロジェクトの詳細、目的、ターゲットなど..."
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900"
                />
              </div>

              <button
                type="submit"
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                プロジェクトを作成
              </button>
            </form>
          </div>
        )}

        {projects.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-lg text-gray-600">プロジェクトがまだありません</p>
            <p className="text-sm text-gray-500 mt-2">「+ 新しいプロジェクト」から作成してください</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden group"
              >
                <div
                  onClick={() => handleSelectProject(project.id)}
                  className="p-6 cursor-pointer"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {project.name}
                  </h3>
                  
                  {project.clientName && (
                    <div className="text-sm text-gray-600 mb-3">
                      <span className="font-medium">クライアント:</span> {project.clientName}
                    </div>
                  )}
                  
                  {project.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {project.description}
                    </p>
                  )}
                  
                  <div className="text-xs text-gray-400">
                    作成日: {new Date(project.createdAt).toLocaleDateString('ja-JP')}
                  </div>
                </div>
                
                <div className="px-6 pb-4 flex gap-2">
                  <button
                    onClick={() => handleSelectProject(project.id)}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    開く
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteProject(project.id, project.name);
                    }}
                    className="px-4 py-2 bg-red-50 text-red-600 text-sm rounded-lg hover:bg-red-100 transition-colors"
                  >
                    削除
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
