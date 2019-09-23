using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using WillCore.UI.CLI.CollectionExtractor;
using WillCore.UI.CLI.FileLogic;

namespace WillCore.UI.CLI
{
    public class CollectionComments
    {
        private const string collectionStartTag = "//<collections>";
        private const string collectionEndTag = "//</collections>";

        public static void ProcessCollectionJS(string fileName)
        {
            var collectionJS = JSValuesExtractor.GetCollections(File.ReadAllText(fileName)).Replace("view.","this.");
            string metaPath = PathHelper.GetMetaFilePath(fileName);
            string metaContent = PathHelper.GetMetaString(metaPath);
            string templateJS = getMetaTemplateWithJSDocComments(collectionJS, metaContent);
            File.WriteAllText(metaPath, templateJS);
        }

        private static string getMetaTemplateWithJSDocComments(string comment, string templateString)
        {
            var htmlStartIndex = templateString.IndexOf(collectionStartTag) + collectionStartTag.Length;
            var htmlEndIndex = templateString.IndexOf(collectionEndTag);
            return templateString.Substring(0, htmlStartIndex) + comment + templateString.Substring(htmlEndIndex);
        }
    }
}
