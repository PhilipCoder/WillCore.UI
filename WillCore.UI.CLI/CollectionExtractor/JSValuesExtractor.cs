using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace WillCore.UI.CLI.CollectionExtractor
{
    /// <summary>
    /// Class to get the contents of the collections function
    /// </summary>
    public static class JSValuesExtractor
    {
        private const string collectionsTag = "collections";

        public static string GetCollections(string inputJS)
        {
            var startIndex = getCollectionIndex(inputJS);
            if (startIndex > -1)
            {
                return GetScopeBlock(inputJS.Substring(startIndex));
            }
            return null;
        }

        private static int getCollectionIndex(string inputJS)
        {
            var collectionIndex = inputJS.IndexOf(collectionsTag);
            var result = 0;
            while (collectionIndex > 0)
            {
                collectionIndex += collectionsTag.Length;
                result += collectionIndex;
                inputJS = inputJS.Substring(collectionIndex);
                if (inputJS.TrimStart().StartsWith("="))
                {
                    return result;
                }
                collectionIndex = inputJS.IndexOf(collectionsTag);
            }
            return -1;
        }

        private static string GetScopeBlock(string code)
        {
            int startPos = -1;
            bool hasInitialized = false;
            int accumelator = 0;
            for (var charIndex = 0; charIndex < code.Length; charIndex++)
            {
                var cChar = code[charIndex];
                switch (cChar)
                {
                    case '{':
                        switch (hasInitialized)
                        {
                            case true:
                                accumelator++;
                                break;
                            case false:
                                accumelator++;
                                startPos = charIndex;
                                hasInitialized = true;
                                break;
                        }
                        break;
                    case '}':
                        switch (hasInitialized)
                        {
                            case true:
                                accumelator--;
                                break;
                        }
                        break;
                }
                if (hasInitialized && accumelator == 0)
                {
                    return code.Substring(startPos+1,charIndex - startPos-1);
                }
            }
            return null;
        }
    }
}
