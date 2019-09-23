using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading;
using System.Timers;
using WillCore.UI.CLI.CollectionExtractor;
using WillCore.UI.CLI.FileLogic;

namespace WillCore.UI.CLI
{
    /// <summary>
    /// Class that handles projects.
    /// </summary>
    public class Project
    {
        private const int changeTimer = 1000;
        private string _projectPath;
        private Dictionary<string, System.Timers.Timer> _files;
        private FileSystemWatcher watcher;
        private String _indexFile = null;
        public Project(string projectPath)
        {
            _projectPath = projectPath;
            _files = Directory
                .EnumerateFiles(projectPath, "*")
                .Where(PathHelper.Allowed)
                .ToDictionary(a => a, getTimer);

            _indexFile = _files.Any(x => Path.GetFileNameWithoutExtension(x.Key) == "index") ? _files.FirstOrDefault(x => Path.GetFileNameWithoutExtension(x.Key) == "index").Key : null;
            init();

        }

        private System.Timers.Timer getTimer(string a)
        {
            var timer = new System.Timers.Timer(changeTimer);
            timer.Elapsed += (Object source, ElapsedEventArgs e) =>
            {
                timer.Stop();
                onFileChanged(a);
            };
            return timer;
        }

        private void init()
        {
            watcher = new FileSystemWatcher();
            watcher.Path = _projectPath;
            watcher.IncludeSubdirectories = true;
            watcher.NotifyFilter =
                NotifyFilters.CreationTime |
                NotifyFilters.FileName |
                NotifyFilters.LastWrite;

            watcher.Filter = "";

            watcher.Changed += handleOnChange;
            watcher.Created += handleOnCreate;

            watcher.EnableRaisingEvents = true;

            Console.WriteLine("Directory file listener initiated...");
        }

        private void onFileChanged(string fileName)
        {
            if (PathHelper.IsHtml(fileName))
            {
                var viewName = Path.GetFileNameWithoutExtension(fileName);
                if (viewName.ToLower() != "index")
                {
                    Console.WriteLine(fileName + " changed");
                    HTMLComments.ProcessHTML(fileName);
                }
            }
            else
            {
                Console.WriteLine("Javascript file changed");
                if (fileName.Contains(".collections"))
                {
                    CollectionComments.ProcessCollectionJS(fileName);
                }
            }
        }



        private void handleOnChange(object source, FileSystemEventArgs e)
        {
            if (_files.ContainsKey(e.FullPath))
            {
                var timer = _files[e.FullPath];
                timer.Stop();
                timer.Start();
            }
        }

        private void handleOnCreate(object source, FileSystemEventArgs e)
        {
            if (!PathHelper.Allowed(e.FullPath)) return;
            if (PathHelper.IsHtml(e.FullPath))
            {
                if (!_files.ContainsKey(e.FullPath))
                {
                    Console.WriteLine($"File: {e.FullPath} {e.ChangeType}");
                    _files.Add(e.FullPath, getTimer(e.FullPath));
                    var viewName = Path.GetFileNameWithoutExtension(e.FullPath);
                    if (viewName.ToLower() == "index")
                    {
                        createIndexView(e);
                    }
                    else if (viewName.StartsWith("_"))
                    {
                        createLayout(e, viewName);
                    }
                    else 
                    {
                        createView(e, viewName);
                    }
                }
            }
        }

        private void createLayout(FileSystemEventArgs e, string viewName)
        {
            View.Create(e.FullPath);
            var indexJS = Path.ChangeExtension(_indexFile, ".js");
            if (_indexFile != null && File.Exists(indexJS))
            {
                var fileContents = File.ReadAllText(indexJS);
                string path = getRelativePath(e.FullPath);
                fileContents = $"{fileContents}\r\n//willCore.{viewName.Substring(1)} = [layout, \"{path}{viewName}.js\", \"{path}{viewName}.html\"];";
                File.WriteAllText(indexJS, fileContents);
            }
        }

        private void createView(FileSystemEventArgs e, string viewName)
        {
            View.Create(e.FullPath);
            var indexJS = Path.ChangeExtension(_indexFile, ".js");
            if (_indexFile != null && File.Exists(indexJS))
            {
                var fileContents = File.ReadAllText(indexJS);
                string path = getRelativePath(e.FullPath);
                fileContents = $"{fileContents}\r\n//willCore.{viewName} = [willCore.$elementID, url, \"{path}{viewName}.js\", url, \"{path}{viewName}.html\", route,\"/\", x=>true];";
                File.WriteAllText(indexJS, fileContents);
            }
        }

        private string getRelativePath(string filePath)
        {
            var fileDirectory = Path.GetDirectoryName(filePath);
            var path = Path.GetRelativePath(_projectPath, fileDirectory).Replace("\\", "/");
            if (path.StartsWith(".")) path = path.Substring(1);
            if (!path.EndsWith("/")) path = $"{path}/";
            if (!path.StartsWith("/")) path = $"/{path}";
            return path;
        }

        private void createIndexView(FileSystemEventArgs e)
        {
            Index.Create(e.FullPath);
            _indexFile = e.FullPath;
        }
    }
}
