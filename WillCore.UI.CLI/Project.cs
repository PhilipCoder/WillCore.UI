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
        private Dictionary<string, System.Timers.Timer> _files;
        private FileSystemWatcher watcher;
        private String _indexFile = null;
        public Project(string projectPath)
        {
            Settings.WorkingDirectory = projectPath;
            Settings.SolutionDirectory = PathHelper.GetSolutionDirectory(projectPath);
            JSCreator.WriteNestingConfig();
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
            watcher.Path = Settings.WorkingDirectory;
            watcher.IncludeSubdirectories = true;
            watcher.NotifyFilter =
                NotifyFilters.CreationTime |
                NotifyFilters.FileName |
                NotifyFilters.DirectoryName |
                NotifyFilters.LastWrite;
            watcher.Filter = "";
            watcher.Changed += handleOnChange;
            watcher.Created += handleOnCreate;
            watcher.Renamed += handleOnRenamed;
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
                    HTMLComments.ProcessHTML(fileName);
                }
            }
            else
            {
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
            if (File.Exists(e.FullPath))
            {
                if (!PathHelper.Allowed(e.FullPath)) return;
                if (PathHelper.IsHtml(e.FullPath))
                {
                    if (!_files.ContainsKey(e.FullPath))
                    {
                        _files.Add(e.FullPath, getTimer(e.FullPath));
                        var viewName = Path.GetFileNameWithoutExtension(e.FullPath);
                        if (viewName.ToLower() == "index")
                        {
                            Index.Create(e.FullPath);
                            _indexFile = e.FullPath;
                        }
                        else if (viewName.StartsWith("_"))
                        {
                            JSCreator.CreateLayout(e.FullPath, viewName, _indexFile);
                        }
                        else
                        {
                            JSCreator.CreateView(e.FullPath, viewName, _indexFile);
                        }
                    }
                }
            }
            else if (Directory.Exists(e.FullPath))
            {
                handleDownloads(e);
            }
        }

        private void handleOnRenamed(object source, RenamedEventArgs e)
        {
            if (File.Exists(e.FullPath))
            {
            }
            else if (Directory.Exists(e.FullPath))
            {
                handleDownloads(e);
            }
        }

        private static void handleDownloads(FileSystemEventArgs e)
        {
            var folderName = new DirectoryInfo(e.FullPath).Name.ToLower();
            if (folderName == "willcore")
            {
                var tempFile = Path.Combine(e.FullPath, "willCore.zip");
                Downloader.DownloadFile(Settings.WillCoreJSUrl, tempFile);
                Downloader.ExtractZipArchive(tempFile, e.FullPath);
                File.Delete(tempFile);
            }
            else if (folderName == "bootstrap")
            {
                var tempFile = Path.Combine(e.FullPath, "bootstrap.zip");
                Downloader.DownloadFile(Settings.BootstrapURL, tempFile);
                Downloader.ExtractZipArchive(tempFile, e.FullPath);
                File.Delete(tempFile);
            }
        }
    }
}
